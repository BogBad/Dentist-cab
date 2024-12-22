import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { AreaGraph } from './area-graph';
import { PieGraph } from './pie-graph';
import { trpc } from '../../../lib/trpc/server';
import {
  CalendarCheckIcon,
  CircleUser,
  LandmarkIcon,
  Users,
} from 'lucide-react';

const DashboardPage = async () => {
  const gendersAnalytics = await trpc.analytics.getGenderStatistics.query();
  const topServices = await trpc.analytics.getTopServices.query();
  const totalPatientsResponse = await trpc.analytics.getTotalPatients.query();
  const totalDoctorsResponse = await trpc.analytics.getTotalDoctors.query();
  const totalRevenueResponse = await trpc.analytics.getTotalRevenue.query();
  const totalEventsResponse = await trpc.analytics.getTotalEvents.query();

  const totalPatients = totalPatientsResponse.totalPatients;
  const totalDoctors = totalDoctorsResponse.totalDoctors;
  const totalRevenue = totalRevenueResponse.totalRevenue;
  const totalEvents = totalEventsResponse.totalEvents;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Прибуток</CardTitle>
            <LandmarkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue} грн.</div>
            <p className="text-xs text-muted-foreground">
              Буде передано на користь фонду
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Працівників</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDoctors}</div>
            <p className="text-xs text-muted-foreground">Всього лікарів</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Відвідування</CardTitle>
            <CalendarCheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Загальна кількість записів
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пацієнти</CardTitle>
            <CircleUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalPatients}</div>
            <p className="text-xs text-muted-foreground">Всього пацієнтів</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <AreaGraph analyticsData={gendersAnalytics} />
        </div>
        <div className="col-span-4 md:col-span-3">
          <PieGraph analyticsData={topServices} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
