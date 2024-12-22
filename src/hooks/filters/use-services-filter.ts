import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { searchParams } from '../../utils/searchparams';
import { filterServices } from '../../utils/filter-utils';
import { Service } from '../../types/service';
import useServicesStore from '../store/use-services-store';

export function useServicesFilter(data: Service[]) {
  const { services, setServices } = useServicesStore((state) => state);

  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q.withDefault('')
  );
  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  useEffect(() => {
    const filteredServices = filterServices(data, {
      search: searchQuery,
      page,
      rowsPerPage: 10,
    });
    setServices(filteredServices);
  }, [searchQuery, page, services.length]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
  };
}
