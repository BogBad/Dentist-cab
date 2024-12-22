'use client';

import { DataTable } from '../../../../../components/ui/table/data-table';
import { DataTableSearch } from '../../../../../components/ui/table/data-table-search';
import { columns } from './columns';
import { useEmployeeTableFilters } from './use-employee-table-filters';
import { Employee } from '../../../../../types/employee';
import { AddEmployeeModal } from '../add-employee-modal';

export default function EmployeeTable({
  data,
  totalData,
}: {
  data: Employee[];
  totalData: number;
}) {
  const { employees, searchQuery, setPage, setSearchQuery } =
    useEmployeeTableFilters(data);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DataTableSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <AddEmployeeModal />
      </div>
      <DataTable columns={columns} data={employees} totalItems={totalData} />
    </div>
  );
}
