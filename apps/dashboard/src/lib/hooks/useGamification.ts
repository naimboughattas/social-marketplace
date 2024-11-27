import { useState, useEffect } from 'react';
import { useAuth } from '../auth';
import { useNotifications } from '../notifications';
import {
  GamificationEvent,
  Achievement,
  Level,
  getCurrentLevel,
  getNextLevel,
  getPointsToNextLevel,
  checkAchievements,
  processGamificationEvent,
  BUYER_LEVELS,
  SELLER_LEVELS,
  BUYER_ACHIEVEMENTS,
  SELLER_ACHIEVEMENTS
} from '../gamification';

interface GamificationStats {
  points: number;
  level: Level;
  nextLevel: Level | null;
  pointsToNextLevel: number;
  monthlyPoints: number;
  totalSpent: number;
  totalEarnings: number;
  achievements: Achievement[];
  history: {
    date: string;
    points: number;
    amount: number;
  }[];
}

const defaultStats: GamificationStats = {
  points: 0,
  level: BUYER_LEVELS[0],
  nextLevel: BUYER_LEVELS[1],
  pointsToNextLevel: BUYER_LEVELS[1].min,
  monthlyPoints: 0,
  totalSpent: 0,
  totalEarnings: 0,
  achievements: [],
  history: []
};

export function useGamification(type: 'buyer' | 'seller') {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [stats, setStats] = useState<GamificationStats>(() => {
    try {
      const savedPoints = parseInt(localStorage.getItem(`${type}_points`) || '0');
      const savedHistory = JSON.parse(localStorage.getItem(`${type}_history`) || '[]');
      const currentLevel = getCurrentLevel(savedPoints, type);
      const nextLevel = getNextLevel(savedPoints, type);
      const pointsToNextLevel = getPointsToNextLevel(savedPoints, type);
      const achievements = type === 'buyer' ? BUYER_ACHIEVEMENTS : SELLER_ACHIEVEMENTS;

      // Calculate total spent/earned from history
      const total = savedHistory.reduce((sum: number, entry: any) => sum + (entry.amount || 0), 0);

      return {
        points: savedPoints,
        level: currentLevel,
        nextLevel,
        pointsToNextLevel,
        monthlyPoints: 0,
        totalSpent: type === 'buyer' ? total : 0,
        totalEarnings: type === 'seller' ? total : 0,
        achievements,
        history: savedHistory
      };
    } catch (error) {
      console.error('Error loading gamification stats:', error);
      return {
        ...defaultStats,
        level: type === 'buyer' ? BUYER_LEVELS[0] : SELLER_LEVELS[0],
        nextLevel: type === 'buyer' ? BUYER_LEVELS[1] : SELLER_LEVELS[1],
        achievements: type === 'buyer' ? BUYER_ACHIEVEMENTS : SELLER_ACHIEVEMENTS
      };
    }
  });

  useEffect(() => {
    // Load stats from localStorage
    const loadStats = () => {
      try {
        const points = parseInt(localStorage.getItem(`${type}_points`) || '0');
        const history = JSON.parse(localStorage.getItem(`${type}_history`) || '[]');
        const currentLevel = getCurrentLevel(points, type);
        const nextLevel = getNextLevel(points, type);
        const pointsToNextLevel = getPointsToNextLevel(points, type);

        // Calculate monthly points
        const now = new Date();
        const monthlyPoints = history
          .filter((entry: any) => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === now.getMonth() &&
                   entryDate.getFullYear() === now.getFullYear();
          })
          .reduce((sum: number, entry: any) => sum + (entry.points || 0), 0);

        // Calculate total spent/earned
        const total = history.reduce((sum: number, entry: any) => sum + (entry.amount || 0), 0);

        setStats(prev => ({
          ...prev,
          points,
          level: currentLevel,
          nextLevel,
          pointsToNextLevel,
          monthlyPoints,
          totalSpent: type === 'buyer' ? total : prev.totalSpent,
          totalEarnings: type === 'seller' ? total : prev.totalEarnings,
          history
        }));
      } catch (error) {
        console.error('Error updating gamification stats:', error);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, [type]);

  const addPoints = (event: GamificationEvent) => {
    try {
      processGamificationEvent(event, type);
      
      const points = parseInt(localStorage.getItem(`${type}_points`) || '0');
      const currentLevel = getCurrentLevel(points, type);
      const nextLevel = getNextLevel(points, type);
      const pointsToNextLevel = getPointsToNextLevel(points, type);
      const history = JSON.parse(localStorage.getItem(`${type}_history`) || '[]');

      setStats(prev => ({
        ...prev,
        points,
        level: currentLevel,
        nextLevel,
        pointsToNextLevel,
        history,
        totalSpent: type === 'buyer' ? prev.totalSpent + (event.data.amount || 0) : prev.totalSpent,
        totalEarnings: type === 'seller' ? prev.totalEarnings + (event.data.amount || 0) : prev.totalEarnings
      }));
    } catch (error) {
      console.error('Error adding points:', error);
      addNotification({
        type: 'error',
        message: 'Une erreur est survenue lors de l\'ajout des points'
      });
    }
  };

  return {
    stats,
    addPoints
  };
}