import DashboardLayout from '../components/DashboardLayout';
import BalanceHeader from '../components/BalanceHeader';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function Dashboard() {
  const { user } = useAuth();

  const businessStats = [
    {
      name: 'Total Orders',
      value: '89',
      change: '+4.75%',
      icon: BarChart3,
    },
    {
      name: 'Engagement Rate',
      value: '5.23%',
      change: '+1.1%',
      icon: TrendingUp,
    },
    {
      name: 'New Followers',
      value: '2,345',
      change: '+11.4%',
      icon: Users,
    },
  ];

  return (
    <DashboardLayout>
      <BalanceHeader />
      
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            {user?.role === 'influencer' 
              ? 'Gérez votre compte et suivez vos performances'
              : 'Aperçu de votre croissance Instagram'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businessStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
              >
                <dt>
                  <div className="absolute rounded-md bg-purple-500 p-3">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      {stat.change}
                    </p>
                  )}
                </dd>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}