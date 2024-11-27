import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, Text, Badge, Grid } from '@tremor/react';
import { UserPlus, Heart, MessageCircle, Share2, ExternalLink, MessageSquare, ArrowLeft } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import Button from '../../components/Button';
import * as Tooltip from '@radix-ui/react-tooltip';

const ServiceIcon = ({ service }: { service: 'follow' | 'like' | 'comment' | 'repost_story' }) => {
  switch (service) {
    case 'follow':
      return <UserPlus className="h-4 w-4" />;
    case 'like':
      return <Heart className="h-4 w-4" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4" />;
    case 'repost_story':
      return <Share2 className="h-4 w-4" />;
  }
};

const statusStyles = {
  pending: { color: 'yellow', label: 'En attente' },
  accepted: { color: 'blue', label: 'Acceptée' },
  delivered: { color: 'purple', label: 'Livrée' },
  completed: { color: 'green', label: 'Terminée' },
  disputed: { color: 'orange', label: 'Contestée' },
  cancelled: { color: 'red', label: 'Annulée' },
  refunded: { color: 'gray', label: 'Remboursée' }
};

// Mock data - À remplacer par les vraies données
const mockOrder = {
  id: '1',
  orderNumber: 5,
  date: new Date(),
  platform: 'instagram',
  customer: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'ACME Inc.',
    ordersCount: 25
  },
  influencer: {
    id: '1',
    name: '@fashion_style',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    ordersCount: 150,
    rating: 4.8
  },
  service: 'follow' as const,
  target: '@target_account',
  price: 4.00,
  status: 'pending' as const,
  timeline: [
    {
      date: new Date(),
      type: 'order_created',
      message: 'Commande créée'
    },
    {
      date: new Date(Date.now() - 3600000),
      type: 'payment_confirmed',
      message: 'Paiement confirmé'
    }
  ]
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order] = useState(mockOrder);
  const [comment, setComment] = useState('');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/orders"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <Title>Commande #{order.orderNumber}</Title>
              <Text>{formatDate(order.date)}</Text>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contacter le client
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contacter l'influenceur
            </Button>
          </div>
        </div>

        <Grid numItemsLg={2} className="gap-6">
          {/* Informations principales */}
          <Card>
            <div className="space-y-6">
              <div>
                <Text className="text-gray-500">Statut</Text>
                <div className="mt-1">
                  <Badge
                    color={statusStyles[order.status].color}
                    size="lg"
                  >
                    {statusStyles[order.status].label}
                  </Badge>
                </div>
              </div>

              <div>
                <Text className="text-gray-500">Service</Text>
                <div className="mt-1 flex items-center space-x-2">
                  <ServiceIcon service={order.service} />
                  <span className="capitalize">{order.service}</span>
                </div>
              </div>

              <div>
                <Text className="text-gray-500">Cible</Text>
                <div className="mt-1">
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
                </div>
              </div>

              <div>
                <Text className="text-gray-500">Prix</Text>
                <div className="mt-1 font-medium">
                  {order.price.toFixed(2)} €
                </div>
              </div>
            </div>
          </Card>

          {/* Client et Influenceur */}
          <div className="space-y-6">
            <Card>
              <Title>Client</Title>
              <div className="mt-4 space-y-4">
                <div>
                  <Text className="text-gray-500">Nom</Text>
                  <Link
                    to={`/admin/customers/${order.customer.id}`}
                    className="mt-1 block font-medium hover:text-purple-600"
                  >
                    {order.customer.name}
                  </Link>
                </div>
                <div>
                  <Text className="text-gray-500">Email</Text>
                  <div className="mt-1">{order.customer.email}</div>
                </div>
                {order.customer.company && (
                  <div>
                    <Text className="text-gray-500">Entreprise</Text>
                    <div className="mt-1">{order.customer.company}</div>
                  </div>
                )}
                <div>
                  <Text className="text-gray-500">Commandes</Text>
                  <div className="mt-1">{order.customer.ordersCount}</div>
                </div>
              </div>
            </Card>

            <Card>
              <Title>Influenceur</Title>
              <div className="mt-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={order.influencer.profileImage}
                    alt={order.influencer.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <Link
                      to={`/admin/customers/${order.influencer.id}`}
                      className="font-medium hover:text-purple-600"
                    >
                      {order.influencer.name}
                    </Link>
                    <div className="text-sm text-gray-500">
                      {order.influencer.ordersCount} commandes • {order.influencer.rating}/5
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Grid>

        {/* Timeline */}
        <Card>
          <Title>Historique</Title>
          <div className="mt-6 space-y-6">
            {order.timeline.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-purple-500 mt-2" />
                </div>
                <div>
                  <div className="font-medium">{event.message}</div>
                  <div className="text-sm text-gray-500">
                    {formatDate(event.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Commentaire interne */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-start space-x-4">
              <div className="min-w-0 flex-1">
                <div className="relative">
                  <textarea
                    rows={3}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    placeholder="Ajouter un commentaire interne..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    disabled={!comment.trim()}
                    onClick={() => {
                      // Ajouter le commentaire
                      setComment('');
                    }}
                  >
                    Commenter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}