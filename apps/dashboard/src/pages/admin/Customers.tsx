import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, TextInput, Select, SelectItem } from '@tremor/react';
import { Search, Mail, MessageSquare, Edit, ExternalLink } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import ActionsMenu from '../../components/ActionsMenu';
import * as Dialog from '@radix-ui/react-dialog';
import Button from '../../components/Button';

interface Customer {
  id: string;
  email: string;
  name?: string;
  company?: string;
  role: 'business' | 'influencer';
  balance: number;
  totalSpent: number;
  ordersCount: number;
  rechargesCount: number;
  lastActive: Date;
  status: 'active' | 'inactive';
  createdAt: Date;
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    company: 'ACME Inc.',
    role: 'business',
    balance: 250.50,
    totalSpent: 1500,
    ordersCount: 25,
    rechargesCount: 5,
    lastActive: new Date(),
    status: 'active',
    createdAt: new Date(2023, 0, 15)
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'influencer',
    balance: 1200,
    totalSpent: 0,
    ordersCount: 0,
    rechargesCount: 0,
    lastActive: new Date(Date.now() - 86400000),
    status: 'active',
    createdAt: new Date(2023, 1, 20)
  },
  {
    id: '3',
    email: 'bob@techcorp.com',
    name: 'Bob Wilson',
    company: 'Tech Corp',
    role: 'business',
    balance: 0,
    totalSpent: 750,
    ordersCount: 12,
    rechargesCount: 3,
    lastActive: new Date(Date.now() - 172800000),
    status: 'inactive',
    createdAt: new Date(2023, 2, 10)
  }
];

export default function AdminCustomers() {
  const [customers] = useState(mockCustomers);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('Tous');
  const [status, setStatus] = useState('Tous');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Filtrer les clients
  const filteredCustomers = customers.filter(customer => {
    if (search && !customer.email.toLowerCase().includes(search.toLowerCase()) &&
        !(customer.name?.toLowerCase().includes(search.toLowerCase())) &&
        !(customer.company?.toLowerCase().includes(search.toLowerCase()))) {
      return false;
    }
    if (role !== 'Tous' && customer.role !== role.toLowerCase()) return false;
    if (status !== 'Tous' && customer.status !== status.toLowerCase()) return false;
    return true;
  });

  const getActions = (customer: Customer) => [
    {
      label: 'Voir détails',
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: () => window.location.href = `/admin/customers/${customer.id}`
    },
    {
      label: 'Modifier',
      icon: <Edit className="h-4 w-4" />,
      onClick: () => {
        setSelectedCustomer(customer);
        setShowEditModal(true);
      }
    },
    {
      label: 'Contacter',
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: () => window.location.href = `mailto:${customer.email}`
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title>Clients</Title>
            <p className="mt-1 text-sm text-gray-500">
              Gérez les clients et influenceurs
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total clients: {customers.length}</p>
            <p className="text-sm text-gray-600">
              Actifs: {customers.filter(c => c.status === 'active').length}
            </p>
          </div>
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <TextInput
              icon={Search}
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={role} onValueChange={setRole}>
              <SelectItem value="Tous">Tous les rôles</SelectItem>
              <SelectItem value="business">Acheteurs</SelectItem>
              <SelectItem value="influencer">Influenceurs</SelectItem>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectItem value="Tous">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
            </Select>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Client</TableHeaderCell>
                <TableHeaderCell>Rôle</TableHeaderCell>
                <TableHeaderCell>Solde</TableHeaderCell>
                <TableHeaderCell>Total dépensé</TableHeaderCell>
                <TableHeaderCell>Commandes</TableHeaderCell>
                <TableHeaderCell>Recharges</TableHeaderCell>
                <TableHeaderCell>Dernière activité</TableHeaderCell>
                <TableHeaderCell>Statut</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Link
                      to={`/admin/customers/${customer.id}`}
                      className="group"
                    >
                      <div className="font-medium text-purple-600 group-hover:text-purple-700">
                        {customer.name || customer.email}
                      </div>
                      {customer.company && (
                        <div className="text-sm text-gray-500">{customer.company}</div>
                      )}
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={customer.role === 'business' ? 'blue' : 'purple'}
                      size="xs"
                    >
                      {customer.role === 'business' ? 'Acheteur' : 'Influenceur'}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.balance.toFixed(2)} €</TableCell>
                  <TableCell>{customer.totalSpent.toFixed(2)} €</TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/customers/${customer.id}?tab=orders`}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      {customer.ordersCount}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/customers/${customer.id}?tab=recharges`}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      {customer.rechargesCount}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(customer.lastActive)}</TableCell>
                  <TableCell>
                    <Badge
                      color={customer.status === 'active' ? 'green' : 'red'}
                      size="xs"
                    >
                      {customer.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ActionsMenu actions={getActions(customer)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Modal de modification */}
      <Dialog.Root open={showEditModal} onOpenChange={setShowEditModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-lg">
            <Dialog.Title className="text-lg font-medium mb-4">
              Modifier le client
            </Dialog.Title>
            
            {selectedCustomer && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={selectedCustomer.name || ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={selectedCustomer.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Entreprise
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={selectedCustomer.company || ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={selectedCustomer.status}
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button onClick={() => setShowEditModal(false)}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </AdminLayout>
  );
}