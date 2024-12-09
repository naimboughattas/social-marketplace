export interface User {
  id: string;
  email: string;
  role: "business" | "influencer" | "admin";
  balance: number;
  pendingBalance?: number;
  name?: string;
  company?: string;
}

export type Platform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "x"
  | "facebook"
  | "linkedin";
export type Service =
  | "follow"
  | "like"
  | "comment"
  | "repost_story"
  | "repost"
  | "connect";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMethod = "card" | "bank" | "paypal";

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
  messages: {
    id: string;
    sender: "user" | "support";
    content: string;
    timestamp: Date;
  }[];
}

export interface Review {
  id: string;
  orderId: string;
  userId: string;
  influencerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: "bank" | "paypal";
  status: "pending" | "processing" | "completed" | "rejected";
  methodId: string;
  billingProfileId: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  method: "card" | "bank" | "paypal";
  status: "pending" | "completed" | "failed";
  reference: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Proposal {
  id: string;
  userId: string;
  influencerId: string;
  service: Service;
  target: string;
  price: number;
  status: "pending" | "accepted" | "delivered" | "completed" | "refused";
  createdAt: Date;
  acceptedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  refusalReason?: string;
}

export interface Order {
  id: string;
  userId: string;
  influencerId: string;
  service: Service;
  target: string;
  price: number;
  status:
    | "pending"
    | "accepted"
    | "delivered"
    | "completed"
    | "disputed"
    | "cancelled";
  createdAt: Date;
  acceptedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  disputeReason?: string;
}

export type NotificationType =
  | "order_status"
  | "new_order"
  | "new_proposal"
  | "funds_added"
  | "earnings_received"
  | "withdrawal_status"
  | "support_reply"
  | "account_verified"
  | "subscription_renewal"
  | "subscription_failed"
  | "level_up"
  | "achievement_unlocked";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, any>;
  link?: string;
}
