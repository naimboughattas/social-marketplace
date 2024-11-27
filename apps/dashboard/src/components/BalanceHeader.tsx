import { Wallet, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../lib/auth';
import Button from './Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNotifications } from '../lib/notifications';

export default function BalanceHeader() {
  const { user, updateBalance } = useAuth();
  const { addNotification } = useNotifications();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0 || amount > (user?.pendingBalance || 0)) {
      addNotification({
        type: 'error',
        message: 'Montant invalide',
      });
      return;
    }

    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour le solde
      updateBalance(amount);
      
      addNotification({
        type: 'success',
        message: `${amount.toFixed(2)} € transférés vers votre solde`,
      });
      
      setShowTransferModal(false);
      setTransferAmount('');
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors du transfert',
      });
    }
  };

  return (
    <>
      <div className="bg-white border-b mb-6">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard/topup" className="group">
                <div className="flex items-center">
                  <Wallet className="h-6 w-6 text-gray-400 mr-2 group-hover:text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Solde disponible</p>
                    <p className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
                      {user?.balance?.toFixed(2) || '0.00'} €
                    </p>
                  </div>
                </div>
              </Link>
              
              {user?.role === 'influencer' && user.pendingBalance! > 0 && (
                <Link to="/dashboard/withdraw" className="group">
                  <div>
                    <p className="text-sm text-gray-500">Gains en attente</p>
                    <p className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
                      {user?.pendingBalance?.toFixed(2) || '0.00'} €
                    </p>
                  </div>
                </Link>
              )}
            </div>
            <div className="flex space-x-4">
              {user?.role === 'business' && (
                <Link to="/dashboard/topup">
                  <Button>
                    Recharger mon compte
                  </Button>
                </Link>
              )}
              {user?.role === 'influencer' && (
                <div className="flex space-x-2">
                  {user.pendingBalance! > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setShowTransferModal(true)}
                    >
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Transférer vers le solde
                    </Button>
                  )}
                  {user.balance! > 0 && (
                    <Link to="/dashboard/withdraw">
                      <Button>
                        Retirer mes gains
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de transfert */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Transférer vers le solde
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant à transférer
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  min="0"
                  max={user?.pendingBalance}
                  step="0.01"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Maximum disponible: {user?.pendingBalance?.toFixed(2)} €
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTransferModal(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleTransfer}>
                  Transférer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}