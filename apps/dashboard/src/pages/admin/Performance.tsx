import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, AreaChart, DonutChart, BarChart } from '@tremor/react';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface ChartData {
  date: string;
  orders: number;
  revenue: number;
  users: number;
}

const mockMetrics: PerformanceMetric[] = [
  {
    name: 'Temps de réponse moyen',
    value: 250,
    change: -15,
    trend: 'down'
  },
  {
    name: 'Taux de succès des requêtes',
    value: 99.9,
    change: 0.2,
    trend: 'up'
  },
  {
    name: 'Utilisation CPU',
    value: 45,
    change: 5,
    trend: 'up'
  },
  {
    name: 'Utilisation mémoire',
    value: 65,
    change: -3,
    trend: 'down'
  }
];

const mockChartData: ChartData[] = Array.from({ length: 24 }, (_, i) => ({
  date: `${i}:00`,
  orders: Math.floor(Math.random() * 100),
  revenue: Math.floor(Math.random() * 1000),
  users: Math.floor(Math.random() * 50)
}));

export default function AdminPerformance() {
  const [metrics] = useState(mockMetrics);
  const [chartData] = useState(mockChartData);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Title>Performance</Title>
          <p className="mt-1 text-sm text-gray-500">
            Surveillez les performances et la santé de la plateforme
          </p>
        </div>

        {/* Métriques clés */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.name}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 truncate">
                    {metric.name}
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {metric.value}
                    {metric.name.includes('Taux') ? '%' : 'ms'}
                  </p>
                </div>
                <div className={`flex items-center ${
                  metric.trend === 'up'
                    ? metric.name.includes('Temps') || metric.name.includes('Utilisation')
                      ? 'text-red-600'
                      : 'text-green-600'
                    : metric.name.includes('Temps') || metric.name.includes('Utilisation')
                      ? 'text-green-600'
                      : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(metric.change)}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Temps de réponse */}
          <Card>
            <Title>Temps de réponse</Title>
            <AreaChart
              className="h-72 mt-4"
              data={chartData}
              index="date"
              categories={["orders"]}
              colors={["purple"]}
              showLegend={false}
              showGridLines={false}
              showAnimation
              curveType="monotone"
            />
          </Card>

          {/* Utilisation des ressources */}
          <Card>
            <Title>Utilisation des ressources</Title>
            <div className="h-72 mt-4">
              <DonutChart
                data={[
                  { name: 'CPU', value: 45 },
                  { name: 'Mémoire', value: 65 },
                  { name: 'Stockage', value: 30 }
                ]}
                category="value"
                index="name"
                colors={["purple", "indigo", "blue"]}
                showAnimation
              />
            </div>
          </Card>

          {/* Trafic */}
          <Card>
            <Title>Trafic</Title>
            <BarChart
              className="h-72 mt-4"
              data={chartData}
              index="date"
              categories={["users"]}
              colors={["purple"]}
              showLegend={false}
              showGridLines={false}
              showAnimation
            />
          </Card>

          {/* Erreurs */}
          <Card>
            <Title>Erreurs</Title>
            <AreaChart
              className="h-72 mt-4"
              data={chartData.map(d => ({
                ...d,
                errors: Math.floor(Math.random() * 10)
              }))}
              index="date"
              categories={["errors"]}
              colors={["red"]}
              showLegend={false}
              showGridLines={false}
              showAnimation
              curveType="monotone"
            />
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}