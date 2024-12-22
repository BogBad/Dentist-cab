'use client';

import { api } from '../../../../lib/trpc/client';
import { DataTable } from '../../../../components/ui/table/data-table';
import { columns } from '../constants/columns';
import { DataTableSearch } from '../../../../components/ui/table/data-table-search';
import { useServicesFilter } from '../../../../hooks/filters/use-services-filter';
import ManageServiceModal from './manage-service-modal';
import useServicesStore from '../../../../hooks/store/use-services-store';
import { useEffect, useState } from 'react';

const ServicesTableContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = api.services.getServices.useQuery();
  const { services, setServices } = useServicesStore((state) => state);
  const { searchQuery, setSearchQuery, setPage } = useServicesFilter(
    data || []
  );

  useEffect(() => {
    if (data && !isLoading) {
      setServices(data);
    }
  }, [isLoading]);

  const totalItems = data?.length || 0;

  return (
    <>
      <div className="flex items-center justify-between">
        <DataTableSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <ManageServiceModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <DataTable
        columns={columns}
        data={services}
        totalItems={totalItems}
        isLoading={isLoading}
      />
    </>
  );
};

export default ServicesTableContent;
