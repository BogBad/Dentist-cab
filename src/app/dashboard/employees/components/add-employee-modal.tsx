'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/ui/form';
import { Input } from '../../../../components/ui/input';
import { Loader2, Plus } from 'lucide-react';
import useDebounce from '../../../../hooks/use-debounce';
import UserCard from '../../../../components/user-card';
import { cn } from '../../../../utils/cn';
import { api } from '../../../../lib/trpc/client';
import { toast } from 'sonner';
import useEmployeesStore from '../../../../hooks/store/use-employees-store';
import { IUser } from '../../../../types/user';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

const formSchema = z.object({
  email: z.string().email('Невірний формат email'),
});

export function AddEmployeeModal() {
  const { data } = useSession();
  const role = data?.user?.role;
  const { employees, setEmployees } = useEmployeesStore((state) => state);
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const email = form.watch('email');
  const debouncedEmail = useDebounce(email, 500);

  const { data: foundUsers, isLoading } = api.users.getUsersByEmail.useQuery({
    email: debouncedEmail,
  });
  const mutation = api.users.addEmployee.useMutation();

  useEffect(() => {
    setIsDebouncing(email !== debouncedEmail);
  }, [email, debouncedEmail]);

  useEffect(() => {
    async function searchUsers() {
      if (debouncedEmail) {
        try {
          setUsers(foundUsers ?? []);
          setSelectedUser(null);
        } catch (error) {
          console.error('Error searching for users:', error);
        }
      } else {
        setUsers([]);
        setSelectedUser(null);
      }
    }

    searchUsers();
  }, [foundUsers, debouncedEmail]);

  async function onSubmit() {
    if (selectedUser) {
      mutation.mutate(
        { id: selectedUser.id },
        {
          onSuccess: () => {
            form.reset();
            setUsers([]);
            setEmployees([...employees, selectedUser]);
            setSelectedUser(null);
            toast.success('Працівника успішно додано');
          },
          onError: () => {
            toast('Помилка при додаванні працівника');
          },
        }
      );
    }
  }

  if (role !== 'ADMIN') return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-medium">
          <Plus className="mr-2 h-4 w-4" /> Додати
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Додати користувача</DialogTitle>
          <DialogDescription>
            Введіть email користувача для пошуку або додавання.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email користувача</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(isLoading || isDebouncing) && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {users.length > 0 && (
              <div className="mt-2 border rounded-md p-2 max-h-[200px] overflow-y-auto">
                {users.map((user) => {
                  const isSelected = selectedUser?.id === user.id;
                  return (
                    <div
                      key={user.id}
                      className={cn(
                        `flex items-center p-1 border border-transparent rounded-md cursor-pointer`,
                        isSelected && 'border-primary'
                      )}
                      onClick={() => setSelectedUser(user)}
                    >
                      <UserCard user={user as User} />
                    </div>
                  );
                })}
              </div>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit} disabled={!selectedUser}>
            Додати користувача
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
