import { Heading } from '../../../components/heading';
import PageContainer from '../../../components/layout/page-container';
import React from 'react';
import ServicesTableContent from './components/services-table-content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Послуги',
};

const DashboardServices = async () => {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Heading title="Послуги" />
        <ServicesTableContent />
      </div>
    </PageContainer>
  );
};

export default DashboardServices;
