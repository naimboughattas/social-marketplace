import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useNotifications } from '../lib/notifications';
import {
  addStats,
  getDailyStats,
  getMonthlyStats,
  getAggregatedStats
} from '../lib/firebase/stats';

interface StatsData {
  orders: any[];
  earnings: any[];
  followers: any[];
  engagement: any[];
  aggregated: {
    totalOrders: number;
    totalEarnings: number;
    totalFollowers: number;
    averageEngagement: number;
  };
}

export function useStats() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData>({
    orders: [],
    earnings: [],
    followers: [],
    engagement: [],
    aggregated: {
      totalOrders: 0,
      totalEarnings: 0,
      totalFollowers: 0,
      averageEngagement: 0
    }
  });

  const fetchStats = async (days = 7) => {
    if (!user) return;

    setLoading(true);
    try {
      const [orders, earnings, followers, engagement, aggregated] = await Promise.all([
        getDailyStats(user.id, 'order', days),
        getDailyStats(user.id, 'earning', days),
        getDailyStats(user.id, 'follower', days),
        getDailyStats(user.id, 'engagement', days),
        getAggregatedStats(user.id)
      ]);

      setStats({
        orders,
        earnings,
        followers,
        engagement,
        aggregated
      });
      setError(null);
    } catch (err) {
      setError('Failed to load statistics');
      addNotification({
        type: 'error',
        message: 'Failed to load statistics'
      });
    } finally {
      setLoading(false);
    }
  };

  const recordStat = async (type: 'order' | 'earning' | 'follower' | 'engagement', value: number) => {
    if (!user) return;

    try {
      await addStats({
        userId: user.id,
        type,
        value
      });

      // Update local stats
      setStats(prev => ({
        ...prev,
        [type + 's']: [...prev[type + 's'], { value, date: new Date() }]
      }));
    } catch (err) {
      console.error('Failed to record stat:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStats();
  }, [user]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    recordStat
  };
}