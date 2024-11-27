// Platform types
export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'x' | 'facebook' | 'linkedin';
export type Service = 'follow' | 'like' | 'comment' | 'repost_story' | 'repost' | 'connect';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'bank' | 'paypal';

// Constants
export const PLATFORMS: Platform[] = ['instagram', 'tiktok', 'youtube', 'x', 'facebook', 'linkedin'];

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  x: 'X',
  facebook: 'Facebook',
  linkedin: 'LinkedIn'
};

export const PLATFORM_SERVICES: Record<Platform, Service[]> = {
  instagram: ['follow', 'like', 'comment', 'repost_story'],
  tiktok: ['follow', 'like', 'comment', 'repost_story'],
  youtube: ['follow', 'like', 'comment'],
  x: ['follow', 'like', 'comment', 'repost'],
  facebook: ['follow', 'like', 'comment', 'repost'],
  linkedin: ['follow', 'connect', 'like', 'comment', 'repost']
};

export const SERVICE_LABELS: Record<Service, string> = {
  follow: 'Follow',
  like: 'Like',
  comment: 'Comment',
  repost_story: 'Repost Story',
  repost: 'Repost',
  connect: 'Se connecter'
};

export const SERVICE_DESCRIPTIONS: Record<Service, string> = {
  follow: 'L\'influenceur s\'abonnera à un compte de votre choix depuis son compte vérifié',
  like: 'L\'influenceur aimera une de vos publications depuis son compte vérifié',
  comment: 'L\'influenceur commentera une de vos publications avec un message personnalisé',
  repost_story: 'L\'influenceur partagera votre publication dans sa story pendant 24h',
  repost: 'L\'influenceur partagera votre publication sur son profil',
  connect: 'L\'influenceur se connectera avec vous sur LinkedIn'
};

export const CATEGORIES = [
  'Lifestyle',
  'Travel',
  'Food',
  'Fashion',
  'Tech',
  'Sports',
  'Beauty',
  'Art',
  'Music',
  'Other'
] as const;

export const LANGUAGES = [
  'English',
  'French',
  'Spanish',
  'Italian',
  'German',
  'Portuguese',
  'Other'
] as const;

export const COUNTRIES = [
  'France',
  'United States',
  'United Kingdom',
  'Germany',
  'Spain',
  'Italy',
  'Canada',
  'Australia',
  'Japan',
  'Brazil',
  'Other'
] as const;

// Interfaces
export interface Payment {
  id: string;
  userId: string;
  amount: {
    ht: number;
    tva: number;
    ttc: number;
  };
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface SocialAccount {
  id: string;
  code: string;
  platform: Platform;
  username: string;
  displayName: string;
  profileImage: string;
  followers: number;
  category: string;
  country: string;
  city: string;
  language: string;
  isVerified: boolean;
  isActive: boolean;
  hideIdentity: boolean;
  prices: {
    [key in Service]?: number;
  };
  availableServices: Service[];
  avgDeliveryTime: number;
  completedOrders: number;
  rating: number;
  pk?: string;
  verificationCode?: string;
  verificationSent?: boolean;
}

export interface Ticket {
  id: string;
  orderId: string;
  orderNumber: number;
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
  }[];
  lastUpdated: Date;
}