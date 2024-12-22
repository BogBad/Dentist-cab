import { createCallerFactory, createTRPCRouter } from './trpc';
import authRoute from '../../api/routes/auth-route';
import usersRoute from '../../api/routes/users-route';
import servicesRoute from '../../api/routes/services-route';
import scheduleRoute from '../../api/routes/schedule-route';
import analyticsRoute from '../../api/routes/analytics-route';

export const appRouter = createTRPCRouter({
  auth: authRoute,
  users: usersRoute,
  services: servicesRoute,
  schedule: scheduleRoute,
  analytics: analyticsRoute,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
