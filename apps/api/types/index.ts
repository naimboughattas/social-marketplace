export interface SocialAccount {
  id: string;
  pageId: string;
  code: string;
  token: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'x' | 'facebook' | 'linkedin';
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
  prices: Record<string, number>;
  availableServices: string[];
  avgDeliveryTime: number;
  completedOrders: number;
  rating: number;
  pk?: string;
  verificationCode?: string;
  verificationSent?: boolean;
}

export interface OAuthResponse {
  access_token: string;
  user_id?: string;
  pk?: string;
}

export interface UserInfo {
  id?: string;
  username?: string;
  name?: string;
  picture?: string;
  followers?: number;
  friends?: number;
  category?: string;
}