'use client';

import { api } from '../../../../lib/trpc/client';
import { DataTable } from '../../../../components/ui/table/data-table';
import { DataTableSearch } from '../../../../components/ui/table/data-table-search';
import { useEffect } from 'react';
import usePatientsStore from '../../../../hooks/store/use-patients-store';
import { columns } from '../constants/columns';
import { usePatientFilter } from '../../../../hooks/filters/use-patients-filter';
import { DataTableFilterBox } from '../../../../components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '../../../../components/ui/table/data-table-reset-filter';
import { GENDER_OPTIONS } from '../constants/gender';
import { useSession } from 'next-auth/react';

const PatientsTableContent = () => {
  const { data: session } = useSession();
  const { data, isLoading } = api.users.getPatients.useQuery();
  const { patients, setPatients } = usePatientsStore((state) => state);
  const {
    searchQuery,
    setSearchQuery,
    gender,
    setGender,
    setPage,
    isAnyFilterActive,
    resetFilters,
  } = usePatientFilter(data || []);

  const userId = session?.user.id;

  useEffect(() => {
    if (data && !isLoading) {
      setPatients(data);
    }
  }, [isLoading]);

  const totalItems = data?.length || 0;

  const sortedPatients = patients.sort((a, b) => {
    if (a.id === userId) return -1;
    if (b.id === userId) return 1;
    return 0;
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableFilterBox
          filterKey="gender"
          title="Стать"
          options={GENDER_OPTIONS}
          setFilterValue={setGender}
          filterValue={gender}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable
        columns={columns}
        data={sortedPatients}
        totalItems={totalItems}
        isLoading={isLoading}
        rowClassName={(row) =>
          row.id === userId ? 'bg-primary/10 hover:bg-primary/20' : ''
        }
      />
    </>
  );
};

export default PatientsTableContent;
