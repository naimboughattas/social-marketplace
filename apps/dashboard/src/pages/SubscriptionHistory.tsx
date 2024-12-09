import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { formatDate } from '../lib/utils';
import ServiceIcon from '../components/ServiceIcon';

interface HistoryItem {
  id: string;
  date: Date;
  type: 'follow' | 'like' | 'comment' | 'repost_story';
  target: string;
  status: 'completed';
}

export default function SubscriptionHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: '1',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'like',
      target: 'https://instagram.com/p/xyz',
      status: 'completed'
    },
    {
      id: '2',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      type: 'like',
      target: 'https://instagram.com/p/abc',
      status: 'completed'
    }
  ]);

  useEffect(() => {
    // Fetch subscription and history data
    // For now using mock data
    setSubscription({
      id,
      type: 'like',
      influencer: {
        username: '@fashion_style',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'
      }
    });
  }, [id]);

  if (!subscription) {
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
          <div className="flex items-center space-x-3">
            <img
              src={subscription.influencer.profileImage}
              alt={subscription.influencer.username}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {subscription.influencer.username}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Historique des interactions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
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
                  Cible
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ServiceIcon service={item.type} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.type === 'follow' ? (
                      item.target
                    ) : (
                      <a
                        href={item.target}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-purple-600 hover:text-purple-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Voir le post
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {history.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun historique disponible
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}