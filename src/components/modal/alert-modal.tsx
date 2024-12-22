'use client';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <Modal
      title="Ви впевнені?"
      description="Після видалення ви не зможете відновити дані."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Скасувати
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Видалити
        </Button>
      </div>
    </Modal>
  );
};
