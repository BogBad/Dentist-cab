import { Heading } from '../../../components/heading';
import PageContainer from '../../../components/layout/page-container';
import React from 'react';
import ProfilePage from './components/profile-page';

export const metadata = {
  title: 'Профіль',
};

const DashboardServices = async () => {
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Heading title="Профіль" />
        <ProfilePage />
      </div>
    </PageContainer>
  );
};

export default DashboardServices;
