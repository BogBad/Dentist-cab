import { createTRPCRouter, protectedProcedure } from '../../lib/trpc/trpc';
import { z } from 'zod';

const usersRoute = createTRPCRouter({
  getEmployee: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({
      where: {
        OR: [{ role: 'ADMIN' }, { role: 'MANAGER' }],
      },
      select: {
        id: true,
        image: true,
        name: true,
        surname: true,
        position: true,
        email: true,
      },
    });
  }),
  getUsersByEmail: protectedProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findMany({
        where: {
          email: {
            contains: input.email,
            mode: 'insensitive',
          },
          role: 'USER',
        },
        select: {
          id: true,
          name: true,
          surname: true,
          email: true,
          image: true,
          position: true,
        },
      });
    }),
  addEmployee: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          role: 'MANAGER',
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    }),
  updateEmployeePosition: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        position: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.update({
          where: {
            id: input.id,
          },
          data: {
            position: input.position,
          },
        });
      } catch (error) {
        throw new Error('Error updating user');
      }
    }),
  deleteEmployee: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: input,
        },
        data: {
          role: 'USER',
        },
      });
    }),
  getPatients: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({
      where: {
        role: 'USER',
      },
      select: {
        id: true,
        image: true,
        name: true,
        surname: true,
        email: true,
        birthDate: true,
        gender: true,
      },
    });
  }),
  getPatient: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: {
          id: input,
        },
        select: {
          id: true,
          image: true,
          name: true,
          surname: true,
          email: true,
          birthDate: true,
          gender: true,
          role: true,
          patientEvents: {
            where: {
              patientId: input,
            },
            select: {
              id: true,
              startDate: true,
              doctor: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                },
              },
              service: {
                select: {
                  name: true,
                  duration: true,
                },
              },
            },
          },
        },
      });
    }),
});

export default usersRoute;
