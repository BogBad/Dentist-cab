'use client';
import { buttonVariants } from '../../../../components/ui/button';
import { NotebookPen, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '../../../../utils/cn';
import { Patient } from '../../../../types/patient';
import { useSession } from 'next-auth/react';

interface CellActionProps {
  patient: Patient;
}

export const CellAction = ({ patient }: CellActionProps) => {
  const { data } = useSession();
  const user = data?.user;

  const isDoctor = user?.role !== 'USER';
  const isUserRecord = patient.id === user?.id;

  return (
    <>
      {isDoctor && (
        <Link
          href="/dashboard/schedule"
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
        >
          <NotebookPen className="h-4 w-4" />
        </Link>
      )}
      {(isDoctor || isUserRecord) && (
        <Link
          href={`/dashboard/patients/${patient.id}`}
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
        >
          <SquareArrowOutUpRight className="h-4 w-4" />
        </Link>
      )}
    </>
  );
};
