'use client';
import { AlertModal } from '../../../../components/modal/alert-modal';
import { Button } from '../../../../components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { api } from '../../../../lib/trpc/client';
import { toast } from 'sonner';
import { Service } from '../../../../types/service';
import ManageServiceModal from './manage-service-modal';
import useServicesStore from '../../../../hooks/store/use-services-store';
import { useSession } from 'next-auth/react';

interface CellActionProps {
  service: Service;
}

export const CellAction = ({ service }: CellActionProps) => {
  const { data } = useSession();
  const { deleteService } = useServicesStore((state) => state);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const mutation = api.services.deleteService.useMutation();

  const onConfirm = () => {
    mutation.mutate(
      { id: service.id },
      {
        onSuccess: () => {
          toast('Послугу успішно видалено');
          deleteService(service.id);
          setDeleteOpen(false);
          window.location.reload();
        },
        onError: () => {
          toast.error('Помилка при видаленні послуги');
        },
      }
    );
  };

  if (data?.user?.role === 'USER') return null;

  return (
    <>
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onConfirm}
        loading={mutation.isLoading}
      />
      <ManageServiceModal
        isOpen={updateOpen}
        setIsOpen={setUpdateOpen}
        service={service}
      />
      <Button variant="ghost" size="icon" onClick={() => setUpdateOpen(true)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </>
  );
};
