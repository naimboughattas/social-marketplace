import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { useNotifications } from '../../lib/notifications';
import WithdrawForm from './components/WithdrawForm';
import WithdrawMethodSelector from './components/WithdrawMethodSelector';
import BillingProfileSelector from './components/BillingProfileSelector';
import WithdrawSummary from './components/WithdrawSummary';

interface WithdrawSectionProps {
  onChangeTab: (index: number) => void;
}

export default function WithdrawSection({ onChangeTab }: WithdrawSectionProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [amount, setAmount] = useState('');
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState<string | null>(null);
  const [selectedBillingProfile, setSelectedBillingProfile] = useState<string | null>(null);

  const handleWithdraw = async () => {
    if (!selectedWithdrawMethod || !selectedBillingProfile) {
      addNotification({
        type: 'error',
        message: 'Veuillez sélectionner une méthode de retrait et un profil de facturation'
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      addNotification({
        type: 'error',
        message: 'Montant invalide'
      });
      return;
    }

    if (withdrawAmount > (user?.pendingBalance || 0)) {
      addNotification({
        type: 'error',
        message: 'Montant supérieur à vos gains disponibles'
      });
      return;
    }

    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        message: 'Demande de retrait envoyée avec succès'
      });

      setAmount('');
      setSelectedWithdrawMethod(null);
      setSelectedBillingProfile(null);
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la demande de retrait'
      });
    }
  };

  return (
    <div className="space-y-6">
      <WithdrawForm
        amount={amount}
        onAmountChange={setAmount}
        maxAmount={user?.pendingBalance || 0}
      />

      {amount && (
        <WithdrawMethodSelector
          selectedMethodId={selectedWithdrawMethod}
          onMethodSelect={setSelectedWithdrawMethod}
          onAddMethod={() => onChangeTab(1)}
        />
      )}

      {selectedWithdrawMethod && (
        <BillingProfileSelector
          selectedProfileId={selectedBillingProfile}
          onProfileSelect={setSelectedBillingProfile}
          onAddProfile={() => onChangeTab(2)}
        />
      )}

      {selectedWithdrawMethod && selectedBillingProfile && (
        <WithdrawSummary
          amount={parseFloat(amount)}
          onConfirm={handleWithdraw}
        />
      )}
    </div>
  );
}