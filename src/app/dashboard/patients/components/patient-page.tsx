'use client';

import ProfileCard from '../../../../components/profile-card';
import { api } from '../../../../lib/trpc/client';
import { FC } from 'react';
import { User } from 'next-auth';
import { PatientWithEvents } from '../../../../types/patient';
import PatientHistory from './patient-history';
import PageSkeleton from '../../../../components/page-skeleton';

interface PatientPageProps {
  id: string;
}

const PatientPage: FC<PatientPageProps> = ({ id }) => {
  const { data, isLoading } = api.users.getPatient.useQuery(id);

  if (isLoading) return <PageSkeleton />;

  if (!data) return null;

  const { patientEvents, ...user } = data;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_2fr]">
      <ProfileCard className="h-fit" user={user as User} />
      <PatientHistory patientEvents={patientEvents} />
    </div>
  );
};

export default PatientPage;
