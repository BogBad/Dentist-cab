import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../lib/trpc/trpc';
import { z } from 'zod';
import { hashPassword } from '../../utils/hashPassword';

const authRoute = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
        name: z.string(),
        surname: z.string(),
        gender: z.enum(['MALE', 'FEMALE']),
        birthDate: z.date().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          surname: input.surname,
          gender: input.gender,
          birthDate: input.birthDate,
          image: input.image,
        },
      });
    }),
  getUserRole: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input,
        },
      });

      return user?.role;
    }),
});

export default authRoute;
