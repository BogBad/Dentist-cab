import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo } from 'react';
import { searchParams } from '../../utils/searchparams';
import { filterPatients, filterServices } from '../../utils/filter-utils';
import { Service } from '../../types/service';
import useServicesStore from '../store/use-services-store';
import usePatientsStore from '../store/use-patients-store';
import { Gender, Patient } from '../../types/patient';

export function usePatientFilter(data: Patient[]) {
  const { patients, setPatients } = usePatientsStore((state) => state);

  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q.withDefault('')
  );

  const [gender, setGender] = useQueryState(
    'gender',
    searchParams.gender.withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setGender(null);

    setPage(1);
  }, [setSearchQuery, setGender, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!gender;
  }, [searchQuery, gender]);

  useEffect(() => {
    const filteredPatients = filterPatients(data, {
      search: searchQuery,
      gender: gender as Gender,
      page,
      rowsPerPage: 10,
    });
    setPatients(filteredPatients);
  }, [searchQuery, page, gender, patients.length]);

  return {
    searchQuery,
    setSearchQuery,
    gender,
    setGender,
    page,
    setPage,
    isAnyFilterActive,
    resetFilters,
  };
}
