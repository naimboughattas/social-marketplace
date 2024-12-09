import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

interface DailyStats {
  date: string;
  followers: number;
  engagement: number;
  reach: number;
}

interface ServiceDistribution {
  name: string;
  value: number;
}

const COLORS = ['#8B5CF6', '#EC4899', '#10B981'];

export default function Stats() {
  const [timeRange, setTimeRange] = useState('7d');
  const [dailyStats] = useState<DailyStats[]>([
    {
      date: '2024-03-10',
      followers: 12500,
      engagement: 4.2,
      reach: 25000,
    },
    {
      date: '2024-03-11',
      followers: 12800,
      engagement: 4.5,
      reach: 27000,
    },
    {
      date: '2024-03-12',
      followers: 13100,
      engagement: 4.3,
      reach: 26000,
    },
    {
      date: '2024-03-13',
      followers: 13500,
      engagement: 4.7,
      reach: 29000,
    },
    {
      date: '2024-03-14',
      followers: 13800,
      engagement: 4.4,
      reach: 28000,
    },
    {
      date: '2024-03-15',
      followers: 14200,
      engagement: 4.6,
      reach: 30000,
    },
  ]);

  const serviceDistribution: ServiceDistribution[] = [
    { name: 'Follows', value: 40 },
    { name: 'Likes', value: 35 },
    { name: 'Comments', value: 25 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
            <p className="mt-1 text-sm text-gray-500">
              Analyse détaillée de vos performances
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Évolution des followers
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), 'dd/MM')}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
                  />
                  <Line
                    type="monotone"
                    dataKey="followers"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Taux d'engagement
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), 'dd/MM')}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
                    formatter={(value) => [`${value}%`, 'Taux d\'engagement']}
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#EC4899"
                    fill="#EC4899"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Portée des publications
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), 'dd/MM')}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
                  />
                  <Area
                    type="monotone"
                    dataKey="reach"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Distribution des services
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}