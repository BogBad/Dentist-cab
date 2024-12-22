import { FC, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Plus } from 'lucide-react';
import { Service, serviceSchema } from '../../../../types/service';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '../../../../components/ui/textarea';
import { api } from '../../../../lib/trpc/client';
import useServicesStore from '../../../../hooks/store/use-services-store';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface ManageServiceModalProps {
  service?: Service;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ManageServiceModal: FC<ManageServiceModalProps> = ({
  service,
  setIsOpen,
  isOpen,
}) => {
  const { data } = useSession();
  const { addService, updateService } = useServicesStore((state) => state);

  const form = useForm<Service>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      id: service?.id ?? '',
      name: service?.name ?? '',
      description: service?.description ?? '',
      price: service?.price ?? 0,
      duration: service?.duration ?? 0,
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
      });
    }
  }, [service]);

  const addServiceMutation = api.services.addService.useMutation();
  const updateServiceMutation = api.services.updateService.useMutation();
  const isUpdate = !!service;
  const onSubmit = (data: Service) => {
    isUpdate
      ? updateServiceMutation.mutate(data, {
          onSuccess: () => {
            setIsOpen(false);
            updateService(data);
            toast.success('Послугу успішно оновлено');
          },
          onError: (error) => {
            toast.error('Помилка', {
              description: error.message,
            });
          },
        })
      : addServiceMutation.mutate(
          {
            name: data.name,
            price: data.price,
            duration: data.duration,
            description: data.description,
          },
          {
            onSuccess: () => {
              setIsOpen(false);
              addService(data);
              window.location.reload();
            },
            onError: (error) => {
              toast.error('Помилка', {
                description: error.message,
              });
            },
          }
        );
  };

  if (data?.user?.role === 'USER') return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {!isUpdate ? (
          <Button className="font-medium" onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Додати
          </Button>
        ) : null}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Редагувати' : 'Додати'} послугу
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col items-end space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="w-full space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Назва</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Введіть назву послуги"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <div className="flex gap-6 justify-between">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="price">Ціна (грн)</FormLabel>
                      <FormControl>
                        <Input
                          id="price"
                          inputMode="numeric"
                          placeholder="Введіть ціну послуги"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.price?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="duration">Тривалість (хв)</FormLabel>
                      <FormControl>
                        <Input
                          id="duration"
                          inputMode="numeric"
                          placeholder="Введіть тривалість послуги"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.duration?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="description">Опис</FormLabel>
                    <FormControl>
                      <Textarea
                        id="description"
                        placeholder="Введіть опис послуги"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.description?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <Button loading={form.formState.isSubmitting} type="submit">
              {isUpdate ? 'Оновити' : 'Додати'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ManageServiceModal;
