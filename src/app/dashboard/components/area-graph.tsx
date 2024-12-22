'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { translateMonth } from '../../../utils/translate-month';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../../../components/ui/chart';

const chartConfig = {
  male: {
    label: 'Чоловіки',
    color: 'hsl(var(--chart-1))',
  },
  female: {
    label: 'Жінки',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface AreaGraphProps {
  analyticsData: IGenderAnalytics[];
}

const monthOrder = [
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'March',
  'April',
];

export function AreaGraph({ analyticsData }: AreaGraphProps) {
  const sortedData = [...analyticsData].sort((a, b) => {
    return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Графік відвідування</CardTitle>
        <CardDescription>
          Показує статистку відвідування за 6 місяців
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={sortedData}
            margin={{
              top: 6,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => translateMonth(value).slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="male"
              type="natural"
              fill="var(--color-female)"
              fillOpacity={0.4}
              stroke="var(--color-female)"
              stackId="a"
            />
            <Area
              dataKey="female"
              type="natural"
              fill="var(--color-male)"
              fillOpacity={0.4}
              stroke="var(--color-male)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
