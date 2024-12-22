'use client';
import { AlertModal } from '../../../../../components/modal/alert-modal';
import { Button } from '../../../../../components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { UpdateUserModal } from '../update-user-modal';
import { Employee } from '../../../../../types/employee';
import { api } from '../../../../../lib/trpc/client';
import useEmployeesStore from '../../../../../hooks/store/use-employees-store';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface CellActionProps {
  employee: Employee;
}

export const CellAction = ({ employee }: CellActionProps) => {
  const { data } = useSession();
  const role = data?.user?.role;
  const { employees, setEmployees } = useEmployeesStore((state) => state);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const mutation = api.users.deleteEmployee.useMutation();

  const onConfirm = () => {
    mutation.mutate(employee.id, {
      onSuccess: () => {
        const updatedEmployees = employees.filter(
          (emp) => emp.id !== employee.id
        );
        setEmployees(updatedEmployees);
        setDeleteOpen(false);
        toast.success('Працівника успішно звільнено');
      },
      onError: () => {
        toast.error('Помилка при видаленні працівника');
      },
    });
  };

  if (role !== 'ADMIN') return null;

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onConfirm}
        loading={mutation.isLoading}
      />
      <UpdateUserModal
        employee={employee}
        isOpen={updateOpen}
        onClose={() => setUpdateOpen(false)}
      />
      <div className="flex gap-3">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setUpdateOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
