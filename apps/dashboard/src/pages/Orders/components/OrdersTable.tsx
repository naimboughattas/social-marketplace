import { UserPlus, Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import Button from '../../../components/Button';
import { Order, STATUS_STYLES, STATUS_LABELS } from '../types';
import StatusBadge from './StatusBadge';
import ServiceIcon from './ServiceIcon';
import * as Tooltip from '@radix-ui/react-tooltip';
import { formatDate } from '../../../lib/utils';

interface OrdersTableProps {
  orders: Order[];
  onAcceptDelivery: (id: string) => void;
  onDispute: (id: string) => void;
  onArchive: (id: string) => void;
}

export default function OrdersTable({
  orders,
  onAcceptDelivery,
  onDispute,
  onArchive
}: OrdersTableProps) {
  return (
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
              Cible
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
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
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <div className="flex items-center">
                        <img
                          src={order.influencer.profileImage}
                          alt={order.influencer.username}
                          className="h-8 w-8 rounded-full"
                        />
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                        sideOffset={5}
                      >
                        {order.influencer.username}
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ServiceIcon service={order.service} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.service === 'follow' ? (
                  order.target
                ) : (
                  <a
                    href={order.target}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-purple-600 hover:text-purple-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Voir le post
                  </a>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {order.price.toFixed(2)} €
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge 
                  status={order.status} 
                  date={order.acceptedAt || order.deliveredAt}
                  type={order.status === 'in_progress' ? 'delivery' : 'validation'}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {order.status === 'delivered' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => onAcceptDelivery(order.id)}
                      >
                        Confirmer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDispute(order.id)}
                      >
                        Contester
                      </Button>
                    </>
                  )}
                  {order.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onArchive(order.id)}
                    >
                      Archiver
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}