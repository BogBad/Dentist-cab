import PatientPage from '../components/patient-page';
import { Heading } from '../../../../components/heading';
import PageContainer from '../../../../components/layout/page-container';
import React from 'react';

interface PatientProps {
  params: {
    patientId: string;
  };
}

export const metadata = {
  title: 'Пацієнт',
};

const Patient = async ({ params }: PatientProps) => {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Heading title="Інформація про пацієнта" />
        <PatientPage id={params.patientId} />
      </div>
    </PageContainer>
  );
};

export default Patient;
