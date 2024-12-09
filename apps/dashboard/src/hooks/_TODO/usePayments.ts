import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useNotifications } from '../lib/notifications';
import {
  createPayment,
  confirmPayment,
  createWithdrawRequest,
  getWithdrawRequests
} from '../lib/firebase/payments';

export function usePayments() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [withdrawRequests, setWithdrawRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchWithdrawRequests = async () => {
      try {
        const requests = await getWithdrawRequests(user.id);
        setWithdrawRequests(requests);
      } catch (err) {
        addNotification({
          type: 'error',
          message: 'Failed to load withdraw requests'
        });
      }
    };

    fetchWithdrawRequests();
  }, [user]);

  const handleTopUp = async (amount: number, method: 'card' | 'bank' | 'paypal', reference: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const paymentId = await createPayment({
        userId: user.id,
        amount,
        method,
        reference
      });

      if (method === 'bank') {
        addNotification({
          type: 'success',
          message: 'Bank transfer request created successfully'
        });
      } else {
        await confirmPayment(paymentId);
        addNotification({
          type: 'success',
          message: 'Payment processed successfully'
        });
      }
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Payment failed'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (amount: number, method: 'bank' | 'paypal') => {
    if (!user) return;
    
    setLoading(true);
    try {
      await createWithdrawRequest({
        userId: user.id,
        amount,
        method
      });

      addNotification({
        type: 'success',
        message: 'Withdrawal request created successfully'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to create withdrawal request'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    withdrawRequests,
    loading,
    handleTopUp,
    handleWithdraw
  };
}