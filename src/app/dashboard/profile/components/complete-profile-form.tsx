'use client';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../../../../components/ui/form';
import AvatarUpload from '../../../../components/avatar-upload';
import { Input } from '../../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Button } from '../../../../components/ui/button';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/ui/popover';
import { cn } from '../../../../utils/cn';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../../../../components/ui/calendar';
import { api } from '../../../../lib/trpc/client';
import { createAvatarPath } from '../../../../utils/create-avatar-path';
import { uk } from 'date-fns/locale';
import { toast } from 'sonner';

export const formSchema = z.object({
  name: z.string().min(2).max(50),
  surname: z.string().min(2).max(50),
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: z.date().nullable(),
  image: z.string().url(),
});

const CompleteProfileForm = () => {
  const { data, update } = useSession();
  const user = data?.user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      surname: user?.surname || '',
      gender: user?.gender,
      birthDate: user?.birthDate
        ? new Date(user.birthDate as unknown as string)
        : null,
      image: user?.image || '',
    },
  });

  const updateProfileMutation = api.auth.updateProfile.useMutation();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let imagePath = values.image;

    if (values.image !== user?.image) {
      const response = await fetch(values.image, { mode: 'no-cors' });
      const blob = await response.blob();
      const file = new File([blob], 'avatar.jpg', { type: blob.type });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('id', user?.id as string);
      await fetch('/api/user', {
        method: 'PUT',
        body: formData,
      });

      imagePath = createAvatarPath(user?.id as string);
    }

    const data = {
      ...values,
      id: user?.id as string,
      image: imagePath,
    };

    try {
      await updateProfileMutation.mutateAsync(data);
      await update({ user: { ...user, ...data } });
      window.location.reload();
    } catch (e) {
      toast.error('Не вдалося зберегти профіль');
    }
  };

  return (
    <Card className="md:row-span-2 md:col-start-2 md:row-start-1">
      <CardHeader>
        <CardTitle>Заповнення профілю</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-center mb-6">
              <AvatarUpload
                onAvatarChange={(file) => {
                  const url = URL.createObjectURL(file);
                  form.setValue('image', url);
                }}
                currentAvatarUrl={form.watch('image')}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Імʼя</FormLabel>
                    <FormControl>
                      <Input placeholder="Введіть імʼя" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Прізвище</FormLabel>
                    <FormControl>
                      <Input placeholder="Введіть прізвище" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full justify-end">
                    <FormLabel>Дата народження</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PP', { locale: uk })
                            ) : (
                              <span>Оберіть дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          locale={uk}
                          captionLayout="dropdown"
                          selected={field.value || new Date('2000-01-01')}
                          onSelect={field.onChange}
                          fromYear={1960}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Стать</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={!field.value ? '' : field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть стать" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Чоловіча</SelectItem>
                        <SelectItem value="FEMALE">Жіноча</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <Button
              loading={form.formState.isSubmitting}
              type="submit"
              className="w-full"
            >
              Зберегти
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CompleteProfileForm;
