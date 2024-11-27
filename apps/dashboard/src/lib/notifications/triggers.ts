import { NotificationType } from '../types/notifications';
import { useNotifications } from './index';

// Fonction utilitaire pour créer des déclencheurs de notification
export function useNotificationTriggers() {
  const { addNotification } = useNotifications();

  const triggers = {
    // Commandes
    orderStatusChanged: (orderNumber: number, status: string) => {
      addNotification({
        type: 'order_status',
        data: { orderNumber, status },
        link: `/dashboard/orders`
      });
    },

    newOrder: (orderNumber: number) => {
      addNotification({
        type: 'new_order',
        data: { orderNumber },
        link: `/dashboard/orders`
      });
    },

    // Propositions
    newProposal: () => {
      addNotification({
        type: 'new_proposal',
        link: `/dashboard/proposals`
      });
    },

    // Finances
    fundsAdded: (amount: number) => {
      addNotification({
        type: 'funds_added',
        data: { amount }
      });
    },

    earningsReceived: (amount: number) => {
      addNotification({
        type: 'earnings_received',
        data: { amount }
      });
    },

    withdrawalStatusChanged: (status: string) => {
      addNotification({
        type: 'withdrawal_status',
        data: { status }
      });
    },

    // Support
    supportReply: (ticketId: string) => {
      addNotification({
        type: 'support_reply',
        link: `/dashboard/support?ticket=${ticketId}`
      });
    },

    // Compte
    accountVerified: () => {
      addNotification({
        type: 'account_verified'
      });
    },

    // Abonnements
    subscriptionRenewed: (orderNumber: number) => {
      addNotification({
        type: 'subscription_renewal',
        data: { orderNumber }
      });
    },

    subscriptionFailed: (orderNumber: number) => {
      addNotification({
        type: 'subscription_failed',
        data: { orderNumber }
      });
    },

    // Gamification
    levelUp: (levelName: string) => {
      addNotification({
        type: 'level_up',
        data: { levelName }
      });
    },

    achievementUnlocked: (title: string) => {
      addNotification({
        type: 'achievement_unlocked',
        data: { title }
      });
    }
  };

  return triggers;
}