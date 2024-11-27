import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, TextInput, Select, SelectItem } from '@tremor/react';
import { Search, UserPlus, Heart, MessageCircle, Share2, ExternalLink, MessageSquare, Filter, ArrowUpDown, Clock } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import ActionsMenu from '../../components/ActionsMenu';
import * as Tooltip from '@radix-ui/react-tooltip';
import Button from '../../components/Button';
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

interface Order {
  id: string;
  orderNumber: number;
  date: Date;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'x' | 'facebook' | 'linkedin';
  customer: {
    id: string;
    name: string;
    email: string;
  };
  influencer: {
    id: string;
    name: string;
    profileImage: string;
  };
  service: 'follow' | 'like' | 'comment' | 'repost_story';
  target: string;
  price: number;
  status: 'pending' | 'accepted' | 'delivered' | 'completed' | 'disputed' | 'cancelled' | 'refunded';
  disputeReason?: string;
  proofUrl?: string;
  deliveryTime?: number;
}

const statusStyles = {
  pending: { color: 'yellow', label: 'En attente' },
  accepted: { color: 'blue', label: 'Acceptée' },
  delivered: { color: 'purple', label: 'Livrée' },
  completed: { color: 'green', label: 'Terminée' },
  disputed: { color: 'orange', label: 'Contestée' },
  cancelled: { color: 'red', label: 'Annulée' },
  refunded: { color: 'gray', label: 'Remboursée' }
};

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

export default function AdminOrders() {
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 5,
      date: new Date(),
      platform: 'instagram',
      customer: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com'
      },
      influencer: {
        id: '1',
        name: '@fashion_style',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'
      },
      service: 'follow',
      target: '@target_account',
      price: 4.00,
      status: 'pending',
      deliveryTime: 24
    },
    {
      id: '2',
      orderNumber: 4,
      date: new Date(Date.now() - 3600000),
      platform: 'instagram',
      customer: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com'
      },
      influencer: {
        id: '2',
        name: '@tech_guru',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'
      },
      service: 'like',
      target: 'https://instagram.com/p/xyz',
      price: 2.00,
      status: 'delivered',
      deliveryTime: 48
    }
  ]);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('Toutes');
  const [status, setStatus] = useState('Tous');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTab, setSelectedTab] = useState('all');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab !== 'all' && order.status !== selectedTab) return false;
    if (search && !order.customer.email.toLowerCase().includes(search.toLowerCase()) &&
        !`#${order.orderNumber}`.includes(search) &&
        !(order.customer.name.toLowerCase().includes(search.toLowerCase())) &&
        !(order.influencer.name.toLowerCase().includes(search.toLowerCase()))) {
      return false;
    }
    if (platform !== 'Toutes' && order.platform !== platform.toLowerCase()) return false;
    if (status !== 'Tous' && statusStyles[order.status].label !== status) return false;
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'date':
        return (a.date.getTime() - b.date.getTime()) * direction;
      case 'orderNumber':
        return (a.orderNumber - b.orderNumber) * direction;
      case 'price':
        return (a.price - b.price) * direction;
      case 'deliveryTime':
        return ((a.deliveryTime || 0) - (b.deliveryTime || 0)) * direction;
      default:
        return 0;
    }
  });

  const getActions = (order: Order) => [
    {
      label: 'Voir détails',
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: () => window.location.href = `/admin/orders/${order.id}`
    },
    {
      label: 'Contacter client',
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: () => window.location.href = `mailto:${order.customer.email}`
    },
    {
      label: 'Contacter influenceur',
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: () => console.log('Contacter influenceur', order.influencer.id)
    }
  ];

  // Statistiques
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => ['accepted', 'delivered'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
    disputed: orders.filter(o => o.status === 'disputed').length
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title>Commandes</Title>
            <p className="mt-1 text-sm text-gray-500">
              Gérez les commandes de la plateforme
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <TextInput
              icon={Search}
              placeholder="Rechercher une commande..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => setPlatform(platform === 'Toutes' ? 'Instagram' : 'Toutes')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres avancés
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-yellow-500">En attente</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-blue-500">En cours</div>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-green-500">Terminées</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-orange-500">Contestées</div>
            <div className="text-2xl font-bold text-orange-600">{stats.disputed}</div>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <div className="p-4 space-y-4">
            <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
              <Tabs.List className="flex space-x-1 border-b">
                <Tabs.Trigger
                  value="all"
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                    selectedTab === 'all'
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  Toutes
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="pending"
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                    selectedTab === 'pending'
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  En attente
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="accepted"
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                    selectedTab === 'accepted'
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  En cours
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="completed"
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                    selectedTab === 'completed'
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  Terminées
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="disputed"
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 -mb-px",
                    selectedTab === 'disputed'
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  Contestées
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={platform} onValueChange={setPlatform}>
                <SelectItem value="Toutes">Toutes les plateformes</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="YouTube">YouTube</SelectItem>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectItem value="Tous">Tous les statuts</SelectItem>
                {Object.values(statusStyles).map(({ label }) => (
                  <SelectItem key={label} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell 
                  className="cursor-pointer"
                  onClick={() => handleSort('orderNumber')}
                >
                  <div className="flex items-center space-x-1">
                    <span>N°</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHeaderCell>
                <TableHeaderCell 
                  className="cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>Client</TableHeaderCell>
                <TableHeaderCell>Influenceur</TableHeaderCell>
                <TableHeaderCell>Service</TableHeaderCell>
                <TableHeaderCell>Cible</TableHeaderCell>
                <TableHeaderCell 
                  className="cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Prix</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>Statut</TableHeaderCell>
                <TableHeaderCell 
                  className="cursor-pointer"
                  onClick={() => handleSort('deliveryTime')}
                >
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Délai</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      #{order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/customers/${order.customer.id}`}
                      className="hover:text-purple-600"
                    >
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/customers/${order.influencer.id}`}
                      className="flex items-center space-x-3 hover:text-purple-600"
                    >
                      <img
                        src={order.influencer.profileImage}
                        alt={order.influencer.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span>{order.influencer.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <ServiceIcon service={order.service} />
                      <span className="capitalize">{order.service}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.service === 'follow' ? (
                      order.target
                    ) : (
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <a
                              href={order.target}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-purple-600 hover:text-purple-700"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Voir le post
                            </a>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="bg-gray-900 text-white px-2 py-1 rounded text-sm max-w-xs break-all"
                              sideOffset={5}
                            >
                              {order.target}
                              <Tooltip.Arrow className="fill-gray-900" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    )}
                  </TableCell>
                  <TableCell>{order.price.toFixed(2)} €</TableCell>
                  <TableCell>
                    <Badge
                      color={statusStyles[order.status].color}
                      size="xs"
                    >
                      {statusStyles[order.status].label}
                    </Badge>
                    {order.disputeReason && (
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <span className="ml-2 text-red-500 cursor-help">⚠️</span>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                              sideOffset={5}
                            >
                              {order.disputeReason}
                              <Tooltip.Arrow className="fill-gray-900" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{order.deliveryTime}h</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ActionsMenu actions={getActions(order)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}