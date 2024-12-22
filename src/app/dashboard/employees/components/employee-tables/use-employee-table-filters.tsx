'use client';

import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { searchParams } from '../../../../../utils/searchparams';
import { Employee, ModifiedEmployee } from '../../../../../types/employee';
import { filterEmployees } from '../../../../../utils/filter-utils';
import useEmployeesStore from '../../../../../hooks/store/use-employees-store';

export function useEmployeeTableFilters(data: Employee[]) {
  const { employees, setEmployees } = useEmployeesStore((state) => state);

  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );
  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  useEffect(() => {
    setEmployees(data);
  }, []);

  useEffect(() => {
    const filteredEmployees = filterEmployees(data, {
      search: searchQuery,
      page,
      rowsPerPage: 10,
    });
    setEmployees(filteredEmployees);
  }, [searchQuery, page]);

  return {
    employees,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
  };
}
