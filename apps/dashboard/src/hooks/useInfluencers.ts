import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useNotifications } from '../lib/notifications';
import { SocialAccount, Service } from '../lib/types';
import {
  getInfluencers,
  getInfluencer,
  updateInfluencerStats,
  updateInfluencerServices,
  getTopInfluencers,
  searchInfluencers
} from '../lib/firebase/influencers';

export function useInfluencers() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [influencers, setInfluencers] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfluencers = async (filters?: {
    platform?: string;
    category?: string;
    country?: string;
    language?: string;
    minFollowers?: number;
    maxFollowers?: number;
    services?: Service[];
    isVerified?: boolean;
  }) => {
    setLoading(true);
    try {
      const results = await getInfluencers(filters);
      setInfluencers(results);
      setError(null);
    } catch (err) {
      setError('Failed to load influencers');
      addNotification({
        type: 'error',
        message: 'Failed to load influencers'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInfluencer = async (id: string) => {
    try {
      const influencer = await getInfluencer(id);
      return influencer;
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to load influencer details'
      });
      throw err;
    }
  };

  const updateStats = async (influencerId: string, updates: {
    completedOrders?: number;
    rating?: number;
    totalEarnings?: number;
  }) => {
    try {
      await updateInfluencerStats(influencerId, updates);
      setInfluencers(influencers.map(inf => {
        if (inf.id === influencerId) {
          return {
            ...inf,
            completedOrders: updates.completedOrders !== undefined 
              ? (inf.completedOrders || 0) + updates.completedOrders
              : inf.completedOrders,
            rating: updates.rating || inf.rating
          };
        }
        return inf;
      }));
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to update influencer stats'
      });
      throw err;
    }
  };

  const updateServices = async (influencerId: string, services: {
    service: Service;
    price: number;
    isActive: boolean;
  }[]) => {
    try {
      await updateInfluencerServices(influencerId, services);
      setInfluencers(influencers.map(inf => {
        if (inf.id === influencerId) {
          const prices: Record<Service, number> = {};
          const availableServices: Service[] = [];

          services.forEach(({ service, price, isActive }) => {
            if (isActive) {
              prices[service] = price;
              availableServices.push(service);
            }
          });

          return {
            ...inf,
            prices,
            availableServices
          };
        }
        return inf;
      }));

      addNotification({
        type: 'success',
        message: 'Services updated successfully'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to update services'
      });
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    fetchInfluencers();
  }, []);

  return {
    influencers,
    loading,
    error,
    fetchInfluencers,
    fetchInfluencer,
    updateStats,
    updateServices
  };
}