export type NotificationType = 
  | 'order_status' 
  | 'new_order'
  | 'new_proposal'
  | 'funds_added'
  | 'earnings_received'
  | 'withdrawal_status'
  | 'support_reply'
  | 'account_verified'
  | 'subscription_renewal'
  | 'subscription_failed'
  | 'level_up'
  | 'achievement_unlocked';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  data?: {
    orderId?: string;
    orderNumber?: number;
    proposalId?: string;
    amount?: number;
    status?: string;
    achievementId?: string;
    levelName?: string;
  };
  link?: string;
}

export interface NotificationTrigger {
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  link?: string;
}