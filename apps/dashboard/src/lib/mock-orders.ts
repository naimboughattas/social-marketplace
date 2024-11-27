import { format, subHours, subDays } from 'date-fns';

// Types
interface Order {
  id: string;
  orderNumber: number;
  date: Date;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'x' | 'facebook' | 'linkedin';
  influencer: string;
  service: 'follow' | 'like' | 'comment' | 'repost_story';
  target: string;
  price: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  proofUrl?: string;
  validatedAt?: Date;
  deliveredAt?: Date;
  disputeReason?: string;
}

interface Proposal {
  id: string;
  orderNumber: number;
  date: Date;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'x' | 'facebook' | 'linkedin';
  client: string;
  service: 'follow' | 'like' | 'comment' | 'repost_story';
  target: string;
  price: number;
  status: 'pending' | 'accepted' | 'delivered' | 'completed' | 'cancelled' | 'refused';
  acceptedAt?: Date;
  deliveredAt?: Date;
  proofImage?: File;
  proofUrl?: string;
  refusalReason?: string;
}

// Mock data - Numéros de commande dans l'ordre décroissant
export const mockOrders: Order[] = [
  {
    id: '5',
    orderNumber: 5,
    date: new Date(),
    platform: 'instagram',
    influencer: '@fashion_style',
    service: 'follow',
    target: '@target_account2',
    price: 4.00,
    status: 'pending'
  },
  {
    id: '4',
    orderNumber: 4,
    date: subHours(new Date(), 2),
    platform: 'instagram',
    influencer: '@tech_guru',
    service: 'repost_story',
    target: 'https://instagram.com/p/def789',
    price: 4.00,
    status: 'disputed',
    proofUrl: 'https://example.com/proof2.jpg',
    disputeReason: 'Le repost n\'est pas visible dans les stories'
  },
  {
    id: '3',
    orderNumber: 3,
    date: subHours(new Date(), 5),
    platform: 'instagram',
    influencer: '@food_lover',
    service: 'comment',
    target: 'https://instagram.com/p/abc456',
    price: 6.00,
    status: 'completed',
    proofUrl: 'https://example.com/proof1.jpg',
    validatedAt: new Date(),
    deliveredAt: subHours(new Date(), 1)
  },
  {
    id: '2',
    orderNumber: 2,
    date: subDays(new Date(), 1),
    platform: 'instagram',
    influencer: '@travel_jack',
    service: 'like',
    target: 'https://instagram.com/p/xyz123',
    price: 1.50,
    status: 'in_progress',
    deliveredAt: new Date()
  },
  {
    id: '1',
    orderNumber: 1,
    date: subDays(new Date(), 2),
    platform: 'instagram',
    influencer: '@lifestyle_emma',
    service: 'follow',
    target: '@target_account1',
    price: 2.00,
    status: 'cancelled'
  }
];

export const mockProposals: Proposal[] = [
  {
    id: '6',
    orderNumber: 6,
    date: new Date(),
    platform: 'instagram',
    client: '@business_account6',
    service: 'comment',
    target: 'https://instagram.com/p/ghi',
    price: 5.00,
    status: 'pending'
  },
  {
    id: '5',
    orderNumber: 5,
    date: subHours(new Date(), 1),
    platform: 'instagram',
    client: '@business_account5',
    service: 'follow',
    target: '@target_account2',
    price: 2.00,
    status: 'refused',
    refusalReason: 'Prix trop bas'
  },
  {
    id: '4',
    orderNumber: 4,
    date: subHours(new Date(), 3),
    platform: 'instagram',
    client: '@business_account4',
    service: 'repost_story',
    target: 'https://instagram.com/p/def',
    price: 3.00,
    status: 'completed',
    acceptedAt: subDays(new Date(), 1),
    deliveredAt: subDays(new Date(), 1),
    proofUrl: 'https://example.com/proof4.jpg'
  },
  {
    id: '3',
    orderNumber: 3,
    date: subDays(new Date(), 1),
    platform: 'instagram',
    client: '@business_account3',
    service: 'like',
    target: 'https://instagram.com/p/abc',
    price: 1.00,
    status: 'delivered',
    acceptedAt: subHours(new Date(), 2),
    deliveredAt: new Date(),
    proofUrl: 'https://example.com/proof3.jpg'
  },
  {
    id: '2',
    orderNumber: 2,
    date: subDays(new Date(), 2),
    platform: 'instagram',
    client: '@business_account2',
    service: 'comment',
    target: 'https://instagram.com/p/xyz',
    price: 5.00,
    status: 'accepted',
    acceptedAt: new Date()
  },
  {
    id: '1',
    orderNumber: 1,
    date: subDays(new Date(), 3),
    platform: 'instagram',
    client: '@business_account1',
    service: 'follow',
    target: '@target_account1',
    price: 2.00,
    status: 'cancelled'
  }
];