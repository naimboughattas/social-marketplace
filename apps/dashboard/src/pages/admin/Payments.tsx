import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, TextInput, Select, SelectItem } from '@tremor/react';
import { Search, CreditCard, Building2, Wallet, ExternalLink, MessageSquare } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import ActionsMenu from '../../components/ActionsMenu';
import * as Tooltip from '@radix-ui/react-tooltip';

interface Payment {
  id: string;
  orderNumber: number;
  date: Date;
  user: {
    id: string;
    email: string;
    name?: string;
    company?: string;
  };
  amount: {
    brut: number;
    commission: number;
    net: number;
  };
  method: 'bank' | 'paypal';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionId?: string;
  bankDetails?: {
    iban: string;
    bic: string;
    accountName: string;
  };
  paypalEmail?: string;
  failureReason?: string;
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: '1',
    orderNumber: 5,
    date: new Date(),
    user: {
      id: '1',
      email: 'influencer1@example.com',
      name: 'Fashion Style',
      company: 'Fashion Style SARL'
    },
    amount: {
      brut: 1000,
      commission: 150,
      net: 850
    },
    method: 'bank',
    status: 'completed',
    transactionId: 'VIR-123456',
    bankDetails: {
      iban: 'FR76••••••••••1234',
      bic: 'BNPAFRPP',
      accountName: 'Fashion Style SARL'
    }
  },
  {
    id: '2',
    orderNumber: 4,
    date: new Date(Date.now() - 3600000),
    user: {
      id: '2',
      email: 'influencer2@example.com',
      name: 'Food Lover'
    },
    amount: {
      brut: 500,
      commission: 75,
      net: 425
    },
    method: 'paypal',
    status: 'processing',
    paypalEmail: 'payments@foodlover.com'
  }
];

const statusStyles = {
  pending: { color: 'yellow', label: 'En attente' },
  processing: { color: 'blue', label: 'En cours' },
  completed: { color: 'green', label: 'Terminé' },
  failed: { color: 'red', label: 'Échoué' }
};

const methodLabels = {
  bank: 'Virement bancaire',
  paypal: 'PayPal'
};

const MethodIcon = ({ method }: { method: 'bank' | 'paypal' }) => {
  switch (method) {
    case 'bank':
      return <Building2 className="h-4 w-4" />;
    case 'paypal':
      return <Wallet className="h-4 w-4" />;
  }
};

export default function AdminPayments() {
  const [payments] = useState(mockPayments);
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('Toutes');
  const [status, setStatus] = useState('Tous');

  // Filtrer les paiements
  const filteredPayments = payments.filter(payment => {
    if (search && !payment.user.email.toLowerCase().includes(search.toLowerCase()) &&
        !`#${payment.orderNumber}`.includes(search) &&
        !(payment.user.name?.toLowerCase().includes(search.toLowerCase())) &&
        !(payment.user.company?.toLowerCase().includes(search.toLowerCase()))) {
      return false;
    }
    if (method !== 'Toutes' && methodLabels[payment.method] !== method) return false;
    if (status !== 'Tous' && statusStyles[payment.status].label !== status) return false;
    return true;
  });

  // Trier les paiements par numéro décroissant
  const sortedPayments = [...filteredPayments].sort((a, b) => b.orderNumber - a.orderNumber);

  // Calculer les totaux
  const totals = sortedPayments.reduce((acc, payment) => {
    if (payment.status !== 'failed') {
      acc.brut += payment.amount.brut;
      acc.commission += payment.amount.commission;
      acc.net += payment.amount.net;
    }
    return acc;
  }, { brut: 0, commission: 0, net: 0 });

  const getActions = (payment: Payment) => {
    const actions = [];

    if (payment.status === 'failed') {
      actions.push({
        label: 'Réessayer',
        icon: <CreditCard className="h-4 w-4" />,
        onClick: () => console.log('Réessayer le paiement', payment.id)
      });
    }

    if (payment.status === 'completed') {
      actions.push({
        label: 'Voir justificatif',
        icon: <ExternalLink className="h-4 w-4" />,
        onClick: () => console.log('Voir justificatif', payment.id)
      });
    }

    actions.push({
      label: 'Contacter',
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: () => console.log('Contacter', payment.user.email)
    });

    return actions;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Title>Paiements</Title>
            <p className="mt-1 text-sm text-gray-500">
              Gérez les paiements aux influenceurs
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total brut: {totals.brut.toFixed(2)} €</p>
            <p className="text-sm text-gray-600">Commission (15%): {totals.commission.toFixed(2)} €</p>
            <p className="text-sm font-medium">Total net: {totals.net.toFixed(2)} €</p>
          </div>
        </div>

        <Card>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <TextInput
              icon={Search}
              placeholder="Rechercher un paiement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={method} onValueChange={setMethod}>
              <SelectItem value="Toutes">Toutes les méthodes</SelectItem>
              {Object.values(methodLabels).map((label) => (
                <SelectItem key={label} value={label}>
                  {label}
                </SelectItem>
              ))}
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

          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Paiement</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Influenceur</TableHeaderCell>
                <TableHeaderCell>Montant brut</TableHeaderCell>
                <TableHeaderCell>Commission</TableHeaderCell>
                <TableHeaderCell>Montant net</TableHeaderCell>
                <TableHeaderCell>Méthode</TableHeaderCell>
                <TableHeaderCell>Statut</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>#{payment.orderNumber}</TableCell>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/customers/${payment.user.id}`}
                      className="hover:text-purple-600"
                    >
                      <div className="font-medium">{payment.user.name || payment.user.email}</div>
                      {payment.user.company && (
                        <div className="text-sm text-gray-500">{payment.user.company}</div>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>{payment.amount.brut.toFixed(2)} €</TableCell>
                  <TableCell>{payment.amount.commission.toFixed(2)} €</TableCell>
                  <TableCell>{payment.amount.net.toFixed(2)} €</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MethodIcon method={payment.method} />
                      <span>{methodLabels[payment.method]}</span>
                    </div>
                    {payment.method === 'bank' && payment.bankDetails && (
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <div className="text-xs text-gray-500 mt-1 cursor-help">
                              IBAN: {payment.bankDetails.iban}
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                              sideOffset={5}
                            >
                              <div>BIC: {payment.bankDetails.bic}</div>
                              <div>Titulaire: {payment.bankDetails.accountName}</div>
                              <Tooltip.Arrow className="fill-gray-900" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    )}
                    {payment.method === 'paypal' && payment.paypalEmail && (
                      <div className="text-xs text-gray-500 mt-1">
                        {payment.paypalEmail}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={statusStyles[payment.status].color}
                      size="xs"
                    >
                      {statusStyles[payment.status].label}
                    </Badge>
                    {payment.failureReason && (
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
                              {payment.failureReason}
                              <Tooltip.Arrow className="fill-gray-900" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    )}
                  </TableCell>
                  <TableCell>
                    <ActionsMenu actions={getActions(payment)} />
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