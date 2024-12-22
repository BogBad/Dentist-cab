import { Heading } from '../../../components/heading';
import PageContainer from '../../../components/layout/page-container';
import React from 'react';
import PatientsTableContent from './components/patients-table-content';

export const metadata = {
  title: 'Пацієнти',
};

const Patients = () => {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Heading title="Пацієнти" />
        <PatientsTableContent />
      </div>
    </PageContainer>
  );
};

export default Patients;
