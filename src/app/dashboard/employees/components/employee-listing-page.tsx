import PageContainer from '../../../../components/layout/page-container';
import EmployeeTable from './employee-tables';
import { Heading } from '../../../../components/heading';
import { trpc } from '../../../../lib/trpc/server';
import employeeMapper from '../../../../utils/employee-mapper';
import React from 'react';

export default async function EmployeeListingPage() {
  const employees = await trpc.users.getEmployee.query();
  const totalUsers = employees.length;

  if (totalUsers === 0) return null;

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <Heading title="Працівники" />
        <EmployeeTable data={employees} totalData={totalUsers} />
      </div>
    </PageContainer>
  );
}
