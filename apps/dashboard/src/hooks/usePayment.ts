import { useState } from 'react';
import { useNotifications } from '../lib/notifications';
import { useAuth } from '../lib/auth';

interface PaymentDetails {
  amount: number;
  method: 'card' | 'bank' | 'paypal';
  methodId: string;
  billingProfileId: string;
}

export function usePayment() {
  const { addNotification } = useNotifications();
  const { updateBalance } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (details: PaymentDetails) => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (details.method === 'bank') {
        addNotification({
          type: 'success',
          message: 'Votre demande a été enregistrée. Nous traiterons votre paiement dès réception du virement.'
        });
      } else {
        updateBalance(details.amount);
        addNotification({
          type: 'success',
          message: `${details.amount.toFixed(2)} € ajoutés à votre solde`
        });
      }
      
      return true;
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors du paiement'
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    processPayment
  };
}