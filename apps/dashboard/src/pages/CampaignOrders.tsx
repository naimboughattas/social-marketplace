import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '../lib/utils';
import Button from '../components/Button';
import ServiceIcon from '../components/ServiceIcon';

interface Order {
  id: string;
  orderNumber: number;
  date: Date;
  influencer: {
    username: string;
    profileImage: string;
  };
  service: 'follow' | 'like' | 'comment' | 'repost_story';
  target: string;
  price: number;
  status: 'completed';
}

export default function CampaignOrders() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 123,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      influencer: {
        username: '@fashion_style',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'
      },
      service: 'like',
      target: 'https://instagram.com/p/xyz',
      price: 2.00,
      status: 'completed'
    },
    {
      id: '2',
      orderNumber: 124,
      date: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
      influencer: {
        username: '@tech_guru',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'
      },
      service: 'like',
      target: 'https://instagram.com/p/xyz',
      price: 2.50,
      status: 'completed'
    }
  ]);

  useEffect(() => {
    // Fetch campaign and orders data
    // For now using mock data
    setCampaign({
      id,
      title: 'Campagne Mode Été 2024',
      currentCount: orders.length,
      totalCount: 50
    });
  }, [id]);

  if (!campaign) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {campaign.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Progression : {campaign.currentCount}/{campaign.totalCount} commandes
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N°
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Influenceur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={order.influencer.profileImage}
                        alt={order.influencer.username}
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="ml-2">{order.influencer.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ServiceIcon service={order.service} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.price.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucune commande complétée pour cette campagne
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}