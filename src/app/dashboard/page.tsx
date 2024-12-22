import PageSkeleton from '../../components/page-skeleton';
import { Heading } from '../../components/heading';
import PageContainer from '../../components/layout/page-container';
import React, { Suspense } from 'react';
import DashboardPage from './components/dashboard-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Головна',
};

export default async function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContainer scrollable>
        <div className="space-y-4">
          <Heading title="Аналітика" />
          <DashboardPage />
        </div>
      </PageContainer>
    </Suspense>
  );
}
