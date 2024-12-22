import { searchParamsCache } from '../../../utils/searchparams';
import React from 'react';
import EmployeeListingPage from './components/employee-listing-page';
import { SearchParams } from 'nuqs/server';

type pageProps = {
  searchParams: SearchParams;
};

export const metadata = {
  title: 'Працівники',
};

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams);

  return <EmployeeListingPage />;
}
