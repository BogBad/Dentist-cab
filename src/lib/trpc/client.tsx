'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  httpBatchLink,
  loggerLink,
  unstable_httpBatchStreamLink,
} from '@trpc/client';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';
import { PropsWithChildren, useState } from 'react';
import SuperJSON from 'superjson';
import { HTTPHeaders } from '@trpc/client';

import { type AppRouter } from './root';
import { createTRPCReact } from '@trpc/react-query';

const createQueryClient = () => new QueryClient();

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    return createQueryClient();
  }
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;

const TRPCReactProvider = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
        unstable_httpBatchStreamLink({
          url: process.env.NEXT_PUBLIC_BASE_URL + '/api/trpc',
          headers: () => {
            const headers: HTTPHeaders = {
              'x-trpc-source': 'nextjs-react',
            };
            return headers;
          },
        }),
      ],
      transformer: SuperJSON,
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </api.Provider>
    </QueryClientProvider>
  );
};

export default TRPCReactProvider;
