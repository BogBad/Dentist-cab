import { createTRPCRouter, protectedProcedure } from '../../lib/trpc/trpc';
import { eventSchema } from '../../types/calendar';

const scheduleRoute = createTRPCRouter({
  getEvents: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.event.findMany({
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
        serviceId: true,
        doctorId: true,
        doctor: {
          select: {
            name: true,
            surname: true,
          },
        },
        patientId: true,
      },
    });
  }),
  addEvent: protectedProcedure
    .input(
      eventSchema.omit({
        id: true,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.event.create({
        data: input,
      });
    }),
  updateEvent: protectedProcedure
    .input(eventSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.event.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
  deleteEvent: protectedProcedure
    .input(eventSchema.pick({ id: true }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.event.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getEvent: protectedProcedure
    .input(eventSchema.pick({ id: true }))
    .query(async ({ input, ctx }) => {
      return ctx.db.event.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          title: true,
          startDate: true,
          endDate: true,
          service: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              surname: true,
              position: true,
            },
          },
          patient: {
            select: {
              id: true,
              name: true,
              surname: true,
            },
          },
        },
      });
    }),
});

export default scheduleRoute;
