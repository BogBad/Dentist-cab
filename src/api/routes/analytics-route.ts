import { createTRPCRouter, protectedProcedure } from '../../lib/trpc/trpc';

const analyticsRoute = createTRPCRouter({
  getGenderStatistics: protectedProcedure.query(async ({ ctx }) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);

    const events = await ctx.db.event.groupBy({
      by: ['startDate', 'patientId'],
      _count: {
        _all: true,
      },
      where: {
        startDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const patients = await ctx.db.user.findMany({
      where: {
        id: {
          in: events.map((event) => event.patientId),
        },
      },
      select: {
        id: true,
        gender: true,
      },
    });

    type GenderStats = {
      [key: string]: { male: number; female: number };
    };

    const genderStats = events.reduce<GenderStats>((acc, event) => {
      const month = event.startDate.toLocaleString('default', {
        month: 'long',
      });
      const patient = patients.find((p) => p.id === event.patientId);
      const gender = patient?.gender || 'UNKNOWN';

      if (!acc[month]) {
        acc[month] = { male: 0, female: 0 };
      }

      if (gender === 'MALE') {
        acc[month].male += event._count._all;
      } else if (gender === 'FEMALE') {
        acc[month].female += event._count._all;
      }

      return acc;
    }, {});

    return Object.keys(genderStats).map((month) => ({
      month,
      male: genderStats[month].male,
      female: genderStats[month].female,
    }));
  }),
  getTopServices: protectedProcedure.query(async ({ ctx }) => {
    const services = await ctx.db.event.groupBy({
      by: ['serviceId'],
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          serviceId: 'desc',
        },
      },
      take: 5,
    });

    const serviceIds = services.map((service) => service.serviceId);
    const serviceDetails = await ctx.db.service.findMany({
      where: {
        id: {
          in: serviceIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    return services.map((service) => {
      const serviceDetail = serviceDetails.find(
        (s) => s.id === service.serviceId
      );
      return {
        service: serviceDetail?.name || 'Unknown',
        records: service._count._all,
      };
    });
  }),
  getTotalPatients: protectedProcedure.query(async ({ ctx }) => {
    const totalPatients = await ctx.db.user.count({
      where: {
        role: 'USER',
      },
    });
    return { totalPatients };
  }),
  getTotalDoctors: protectedProcedure.query(async ({ ctx }) => {
    const totalDoctors = await ctx.db.user.count({
      where: {
        role: {
          in: ['ADMIN', 'MANAGER'],
        },
      },
    });
    return { totalDoctors };
  }),
  getTotalRevenue: protectedProcedure.query(async ({ ctx }) => {
    const totalRevenue = await ctx.db.event.findMany({
      include: {
        service: true,
      },
    });

    const revenue = (totalRevenue || []).reduce((acc, event) => {
      return acc + (event.service?.price || 0);
    }, 0);

    return { totalRevenue: revenue };
  }),
  getTotalEvents: protectedProcedure.query(async ({ ctx }) => {
    const totalEvents = await ctx.db.event.count();
    return { totalEvents };
  }),
});

export default analyticsRoute;
