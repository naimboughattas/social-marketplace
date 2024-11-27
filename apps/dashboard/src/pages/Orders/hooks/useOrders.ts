import { useState, useEffect } from 'react';
import { useAuth } from '../../../lib/auth';
import { useNotifications } from '../../../lib/notifications';
import { Order } from '../types';
import { 
  getOrders as getFirebaseOrders,
  acceptOrder,
  deliverOrder,
  completeOrder,
  disputeOrder,
  cancelOrder 
} from '../../../lib/firebase/orders';

export function useOrders() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await getFirebaseOrders(user.id);
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        setError('Error fetching orders');
        addNotification({
          type: 'error',
          message: 'Failed to load orders'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleDispute = async (orderId: string, reason: string) => {
    try {
      await disputeOrder(orderId, reason);
      setOrders(orders.map(o => 
        o.id === orderId ? {
          ...o,
          status: 'disputed',
          disputeReason: reason
        } : o
      ));
      addNotification({
        type: 'success',
        message: 'Livraison contestée'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la contestation'
      });
    }
  };

  const handleAcceptDelivery = async (orderId: string) => {
    try {
      await completeOrder(orderId);
      setOrders(orders.map(o => 
        o.id === orderId ? {
          ...o,
          status: 'completed'
        } : o
      ));
      addNotification({
        type: 'success',
        message: 'Livraison acceptée'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'acceptation'
      });
    }
  };

  const handleArchive = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      setOrders(orders.map(o => 
        o.id === orderId ? {
          ...o,
          status: 'archived'
        } : o
      ));
      addNotification({
        type: 'success',
        message: 'Commande archivée'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'archivage'
      });
    }
  };

  return {
    orders,
    loading,
    error,
    handleDispute,
    handleAcceptDelivery,
    handleArchive
  };
}