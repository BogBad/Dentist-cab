import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../lib/trpc/trpc';
import { serviceSchema } from '../../types/service';

const servicesRoute = createTRPCRouter({
  getServices: publicProcedure.query(async ({ ctx }) => {
    return (
      ctx.db.service.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          duration: true,
        },
      }) || []
    );
  }),
  addService: protectedProcedure
    .input(serviceSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.service.create({
        data: input,
      });
    }),
  updateService: protectedProcedure
    .input(serviceSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.service.update({
        where: { id: input.id },
        data: input,
      });
    }),
  deleteService: protectedProcedure
    .input(
      serviceSchema.pick({
        id: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.event.deleteMany({
        where: { serviceId: input.id },
      });

      return ctx.db.service.delete({
        where: { id: input.id },
      });
    }),
});

export default servicesRoute;
