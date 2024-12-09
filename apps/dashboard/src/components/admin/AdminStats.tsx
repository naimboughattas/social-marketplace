import { Card, Title, Text, AreaChart, DonutChart } from '@tremor/react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Stat {
  name: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  description: string;
}

interface AdminStatsProps {
  stats: Stat[];
  chartData: any[];
  distributionData: any[];
}

export default function AdminStats({ stats, chartData, distributionData }: AdminStatsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name} decoration="top" decorationColor={stat.trend === 'up' ? 'green' : 'red'}>
            <div className="flex items-start justify-between">
              <div>
                <Text>{stat.name}</Text>
                <Title>{stat.value}</Title>
                <Text className="text-xs text-gray-500">{stat.description}</Text>
              </div>
              <div className={cn(
                "flex items-center text-sm font-medium",
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {stat.change}%
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <Title>Évolution</Title>
          <AreaChart
            className="h-72 mt-4"
            data={chartData}
            index="date"
            categories={["value"]}
            colors={["purple"]}
            showLegend={false}
            showGridLines={false}
            showAnimation
            curveType="monotone"
          />
        </Card>

        <Card>
          <Title>Distribution</Title>
          <DonutChart
            className="h-72 mt-4"
            data={distributionData}
            category="value"
            index="name"
            colors={["purple", "indigo", "blue"]}
            showAnimation
          />
        </Card>
      </div>
    </div>
  );
}