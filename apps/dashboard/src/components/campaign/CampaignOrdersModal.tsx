import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { formatDate } from '../../lib/utils';
import ServiceIcon from '../ServiceIcon';

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

interface CampaignOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  currentCount: number;
  totalCount: number;
}

// Données fictives pour la démo
const MOCK_CAMPAIGN_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 123,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 jours avant
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
  },
  {
    id: '3',
    orderNumber: 125,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    influencer: {
      username: '@travel_addict',
      profileImage: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=300&h=300&fit=crop'
    },
    service: 'like',
    target: 'https://instagram.com/p/xyz',
    price: 1.80,
    status: 'completed'
  },
  {
    id: '4',
    orderNumber: 126,
    date: new Date(Date.now() - 12 * 60 * 60 * 1000),
    influencer: {
      username: '@food_lover',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop'
    },
    service: 'like',
    target: 'https://instagram.com/p/xyz',
    price: 2.20,
    status: 'completed'
  },
  {
    id: '5',
    orderNumber: 127,
    date: new Date(Date.now() - 6 * 60 * 60 * 1000),
    influencer: {
      username: '@art_gallery',
      profileImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&h=300&fit=crop'
    },
    service: 'like',
    target: 'https://instagram.com/p/xyz',
    price: 1.90,
    status: 'completed'
  }
];

export default function CampaignOrdersModal({
  isOpen,
  onClose,
  campaignId,
  currentCount,
  totalCount
}: CampaignOrdersModalProps) {
  // Pour la démo, on utilise les données fictives
  const orders = MOCK_CAMPAIGN_ORDERS;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-[5%] left-1/2 -translate-x-1/2 bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-medium">
              Progression de la campagne ({currentCount}/{totalCount})
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      N°
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Influenceur
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}