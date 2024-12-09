import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useNotifications } from '../lib/notifications';
import {
  createWithdrawRequest,
  getWithdrawRequests,
  cancelWithdrawRequest
} from '../lib/firebase/withdrawals';

export function useWithdraw() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        const fetchedWithdrawals = await getWithdrawRequests(user.id);
        setWithdrawals(fetchedWithdrawals);
        setError(null);
      } catch (err) {
        setError('Failed to load withdrawals');
        addNotification({
          type: 'error',
          message: 'Failed to load withdrawal history'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, [user]);

  const handleWithdraw = async (amount: number, methodId: string, billingProfileId: string) => {
    if (!user) return;
    
    try {
      await createWithdrawRequest({
        userId: user.id,
        amount,
        methodId,
        billingProfileId,
        method: 'bank' // TODO: Get from method details
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
    }
  };

  const handleCancel = async (withdrawalId: string) => {
    if (!user) return;

    try {
      await cancelWithdrawRequest(withdrawalId, user.id);
      setWithdrawals(withdrawals.filter(w => w.id !== withdrawalId));
      addNotification({
        type: 'success',
        message: 'Withdrawal cancelled successfully'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to cancel withdrawal'
      });
      throw err;
    }
  };

  return {
    withdrawals,
    loading,
    error,
    handleWithdraw,
    handleCancel
  };
}