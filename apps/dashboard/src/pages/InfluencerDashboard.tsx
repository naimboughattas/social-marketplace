import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../lib/auth';
import { Wallet, TrendingUp, DollarSign, Settings } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

interface PriceSettings {
  follow: number;
  like: number;
  comment: number;
}

interface Order {
  id: string;
  date: string;
  service: 'follow' | 'like' | 'comment';
  client: string;
  status: 'pending' | 'completed';
  price: number;
}

export default function InfluencerDashboard() {
  const { user } = useAuth();
  const [prices, setPrices] = useState<PriceSettings>({
    follow: 2,
    like: 1,
    comment: 5,
  });
  const [isEditingPrices, setIsEditingPrices] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Mock data
  const recentOrders: Order[] = [
    {
      id: '1',
      date: '2024-03-15',
      service: 'follow',
      client: '@business_account1',
      status: 'pending',
      price: 2.00,
    },
    {
      id: '2',
      date: '2024-03-14',
      service: 'comment',
      client: '@business_account2',
      status: 'completed',
      price: 5.00,
    },
  ];

  const stats = [
    {
      name: 'Available Balance',
      value: `$${user?.balance?.toFixed(2)}`,
      icon: Wallet,
    },
    {
      name: 'This Month',
      value: '$245.80',
      icon: TrendingUp,
    },
    {
      name: 'Total Earned',
      value: '$1,459.25',
      icon: DollarSign,
    },
  ];

  const handlePriceUpdate = () => {
    // TODO: API call to update prices
    setIsEditingPrices(false);
  };

  const handleWithdraw = () => {
    // TODO: API call to process withdrawal
    alert(`Withdrawal of $${withdrawAmount} initiated`);
    setWithdrawAmount('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Influencer Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account, track earnings, and handle orders
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
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
                </dd>
              </div>
            );
          })}
        </div>

        {/* Price Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Price Settings</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingPrices(!isEditingPrices)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isEditingPrices ? 'Cancel' : 'Edit Prices'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Follow</label>
              <Input
                type="number"
                value={prices.follow}
                onChange={(e) => setPrices({ ...prices, follow: parseFloat(e.target.value) })}
                disabled={!isEditingPrices}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Like</label>
              <Input
                type="number"
                value={prices.like}
                onChange={(e) => setPrices({ ...prices, like: parseFloat(e.target.value) })}
                disabled={!isEditingPrices}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <Input
                type="number"
                value={prices.comment}
                onChange={(e) => setPrices({ ...prices, comment: parseFloat(e.target.value) })}
                disabled={!isEditingPrices}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {isEditingPrices && (
            <Button className="mt-4" onClick={handlePriceUpdate}>
              Save Changes
            </Button>
          )}
        </div>

        {/* Withdrawal */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Withdraw Funds</h3>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Input
                label="Amount to withdraw"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Enter amount..."
              />
            </div>
            <Button onClick={handleWithdraw} disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0}>
              Withdraw
            </Button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {order.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}