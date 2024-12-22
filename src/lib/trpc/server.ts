import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import { createTRPCContext } from './trpc';
import { appRouter, AppRouter, createCaller } from './root';
import {
  createTRPCProxyClient,
  loggerLink,
  TRPCClientError,
} from '@trpc/client';
import { transformer } from './shared';
import { observable } from '@trpc/server/observable';
import { callProcedure } from '@trpc/server';
import { TRPCErrorResponse } from '@trpc/server/rpc';

const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set('x-trpc-source', 'rsc');

  return await createTRPCContext({
    headers: heads,
  });
});

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === 'development' ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
    /**
     * Custom RSC link that lets us invoke procedures without using http requests. Since Server
     * Components always run on the server, we can just call the procedure as a function.
     */
    () =>
      ({ op }) =>
        observable((observer) => {
          createContext()
            .then((ctx) => {
              return callProcedure({
                procedures: appRouter._def.procedures,
                path: op.path,
                rawInput: op.input,
                ctx,
                type: op.type,
              });
            })
            .then((data) => {
              observer.next({ result: { data } });
              observer.complete();
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause));
            });
        }),
  ],
});
