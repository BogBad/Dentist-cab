'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart, Cell } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  visitors: {
    label: 'Visitors',
  },
  service1: {
    label: 'Service 1',
    color: '#8884d8',
  },
  service2: {
    label: 'Service 2',
    color: '#82ca9d',
  },
  service3: {
    label: 'Service 3',
    color: '#ffc658',
  },
  service4: {
    label: 'Service 4',
    color: '#ff8042',
  },
  service5: {
    label: 'Service 5',
    color: '#8dd1e1',
  },
} satisfies ChartConfig;

interface AreaGraphProps {
  analyticsData: ITopServicesAnalytics[];
}

export function PieGraph({ analyticsData }: AreaGraphProps) {
  const totalVisitors = React.useMemo(() => {
    return analyticsData?.reduce((acc, curr) => acc + curr.records, 0);
  }, [analyticsData]);

  const colors = [
    chartConfig.service1.color,
    chartConfig.service2.color,
    chartConfig.service3.color,
    chartConfig.service4.color,
    chartConfig.service5.color,
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Найпопулярніші послуги</CardTitle>
        <CardDescription>Вер 2024 - Бер 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={analyticsData}
              dataKey="records"
              nameKey="service"
              innerRadius={60}
              strokeWidth={5}
            >
              {analyticsData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Всього
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
