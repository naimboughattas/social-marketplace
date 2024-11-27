import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, TextInput, Select, SelectItem } from '@tremor/react';
import { Search, CreditCard, Building2, Wallet, CheckCircle, X } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import Button from '../../components/Button';
import { useNotifications } from '../../lib/notifications';
import { Payment, PaymentStatus } from '../../lib/types';

// Mock data
const mockPayments: Payment[] = [
  {
    id: '1',
    userId: 'user1',
    amount: {
      ht: 100,
      tva: 20,
      ttc: 120
    },
    method: 'bank',
    status: 'pending',
    reference: 'REF-123ABC',
    createdAt: new Date()
  },
  // ... autres paiements
];

export default function AdminRecharges() {
  const { addNotification } = useNotifications();
  const [payments] = useState(mockPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const handleApprovePayment = async (paymentId: string) => {
    try {
      // API call to approve payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        message: 'Paiement approuvé avec succès'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'approbation du paiement'
      });
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    try {
      // API call to reject payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        message: 'Paiement rejeté'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors du rejet du paiement'
      });
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
    if (methodFilter !== 'all' && payment.method !== methodFilter) return false;
    if (search && !payment.reference?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title>Recharges</Title>
          <div className="flex space-x-4">
            <TextInput
              icon={Search}
              placeholder="Rechercher une référence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectItem value="all">Tous les moyens</SelectItem>
              <SelectItem value="card">Carte bancaire</SelectItem>
              <SelectItem value="bank">Virement</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
              <SelectItem value="failed">Échoué</SelectItem>
            </Select>
          </div>
        </div>

        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Référence</TableHeaderCell>
                <TableHeaderCell>Client</TableHeaderCell>
                <TableHeaderCell>Montant HT</TableHeaderCell>
                <TableHeaderCell>TVA</TableHeaderCell>
                <TableHeaderCell>Total TTC</TableHeaderCell>
                <TableHeaderCell>Méthode</TableHeaderCell>
                <TableHeaderCell>Statut</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>
                    <span className="font-mono">{payment.reference}</span>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/customers/${payment.userId}`}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      Voir le client
                    </Link>
                  </TableCell>
                  <TableCell>{payment.amount.ht.toFixed(2)} €</TableCell>
                  <TableCell>{payment.amount.tva.toFixed(2)} €</TableCell>
                  <TableCell>{payment.amount.ttc.toFixed(2)} €</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {payment.method === 'card' && <CreditCard className="h-4 w-4" />}
                      {payment.method === 'bank' && <Building2 className="h-4 w-4" />}
                      {payment.method === 'paypal' && <Wallet className="h-4 w-4" />}
                      <span>
                        {payment.method === 'card' && 'Carte bancaire'}
                        {payment.method === 'bank' && 'Virement'}
                        {payment.method === 'paypal' && 'PayPal'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      color={
                        payment.status === 'completed' ? 'green' :
                        payment.status === 'pending' ? 'yellow' :
                        payment.status === 'failed' ? 'red' : 'gray'
                      }
                    >
                      {payment.status === 'completed' && 'Terminé'}
                      {payment.status === 'pending' && 'En attente'}
                      {payment.status === 'failed' && 'Échoué'}
                      {payment.status === 'refunded' && 'Remboursé'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.status === 'pending' && payment.method === 'bank' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprovePayment(payment.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectPayment(payment.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    )}
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