import { Platform } from './types';

// Types
export interface GamificationEvent {
  type: 'purchase' | 'sale' | 'review' | 'delivery' | 'referral';
  data: {
    amount?: number;
    count?: number;
    rating?: number;
    deliveryTime?: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  reward: number;
  type: 'buyer' | 'seller';
}

export interface Level {
  name: string;
  min: number;
  max: number | null;
  color: string;
  benefits: string[];
}

// Constants
export const BUYER_LEVELS: Level[] = [
  {
    name: 'Bronze',
    min: 0,
    max: 1000,
    color: 'from-orange-400 to-orange-600',
    benefits: [
      'Accès aux offres exclusives',
      'Support prioritaire',
      'Badge Bronze sur le profil'
    ]
  },
  {
    name: 'Argent',
    min: 1000,
    max: 5000,
    color: 'from-gray-400 to-gray-600',
    benefits: [
      'Tous les avantages Bronze',
      '-5% sur les commandes',
      'Badge Argent sur le profil',
      'Accès anticipé aux nouveaux influenceurs'
    ]
  },
  {
    name: 'Or',
    min: 5000,
    max: 20000,
    color: 'from-yellow-400 to-yellow-600',
    benefits: [
      'Tous les avantages Argent',
      '-10% sur les commandes',
      'Badge Or sur le profil',
      'Account Manager dédié'
    ]
  },
  {
    name: 'Platine',
    min: 20000,
    max: 50000,
    color: 'from-blue-400 to-blue-600',
    benefits: [
      'Tous les avantages Or',
      '-15% sur les commandes',
      'Badge Platine sur le profil',
      'Service client VIP 24/7',
      'Accès aux influenceurs exclusifs'
    ]
  },
  {
    name: 'Diamant',
    min: 50000,
    max: null,
    color: 'from-purple-400 to-purple-600',
    benefits: [
      'Tous les avantages Platine',
      '-20% sur les commandes',
      'Badge Diamant sur le profil',
      'Accès aux événements privés',
      'Campagnes personnalisées'
    ]
  }
];

export const SELLER_LEVELS: Level[] = [
  {
    name: 'Débutant',
    min: 0,
    max: 1000,
    color: 'from-green-400 to-green-600',
    benefits: [
      'Accès au marketplace',
      'Support standard',
      'Badge Débutant sur le profil'
    ]
  },
  {
    name: 'Confirmé',
    min: 1000,
    max: 5000,
    color: 'from-blue-400 to-blue-600',
    benefits: [
      'Tous les avantages Débutant',
      'Commission réduite de 2%',
      'Badge Confirmé sur le profil',
      'Mise en avant occasionnelle'
    ]
  },
  {
    name: 'Expert',
    min: 5000,
    max: 20000,
    color: 'from-purple-400 to-purple-600',
    benefits: [
      'Tous les avantages Confirmé',
      'Commission réduite de 5%',
      'Badge Expert sur le profil',
      'Mise en avant régulière',
      'Accès aux clients VIP'
    ]
  },
  {
    name: 'Elite',
    min: 20000,
    max: 50000,
    color: 'from-pink-400 to-pink-600',
    benefits: [
      'Tous les avantages Expert',
      'Commission réduite de 10%',
      'Badge Elite sur le profil',
      'Mise en avant premium',
      'Account Manager dédié'
    ]
  },
  {
    name: 'Legend',
    min: 50000,
    max: null,
    color: 'from-red-400 to-red-600',
    benefits: [
      'Tous les avantages Elite',
      'Commission réduite de 15%',
      'Badge Legend sur le profil',
      'Accès aux événements exclusifs',
      'Opportunités spéciales'
    ]
  }
];

export const BUYER_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_purchase',
    title: 'Première commande',
    description: 'Effectuez votre première commande',
    target: 1,
    progress: 0,
    completed: false,
    reward: 100,
    type: 'buyer'
  },
  {
    id: 'big_spender',
    title: 'Grand dépensier',
    description: 'Dépensez plus de 1000€',
    target: 1000,
    progress: 0,
    completed: false,
    reward: 500,
    type: 'buyer'
  },
  {
    id: 'loyal_customer',
    title: 'Client fidèle',
    description: 'Passez 10 commandes',
    target: 10,
    progress: 0,
    completed: false,
    reward: 300,
    type: 'buyer'
  }
];

export const SELLER_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_sale',
    title: 'Première vente',
    description: 'Réalisez votre première vente',
    target: 1,
    progress: 0,
    completed: false,
    reward: 100,
    type: 'seller'
  },
  {
    id: 'fast_delivery',
    title: 'Livraison rapide',
    description: 'Livrez 10 commandes en moins de 24h',
    target: 10,
    progress: 0,
    completed: false,
    reward: 300,
    type: 'seller'
  },
  {
    id: 'perfect_rating',
    title: 'Note parfaite',
    description: 'Obtenez 10 évaluations 5 étoiles',
    target: 10,
    progress: 0,
    completed: false,
    reward: 500,
    type: 'seller'
  }
];

// Helper functions
export function getCurrentLevel(points: number, type: 'buyer' | 'seller'): Level {
  const levels = type === 'buyer' ? BUYER_LEVELS : SELLER_LEVELS;
  return levels.find(level => 
    points >= level.min && (!level.max || points < level.max)
  ) || levels[levels.length - 1];
}

export function getNextLevel(points: number, type: 'buyer' | 'seller'): Level | null {
  const levels = type === 'buyer' ? BUYER_LEVELS : SELLER_LEVELS;
  const currentLevelIndex = levels.findIndex(level => 
    points >= level.min && (!level.max || points < level.max)
  );
  return currentLevelIndex < levels.length - 1 ? levels[currentLevelIndex + 1] : null;
}

export function getPointsToNextLevel(points: number, type: 'buyer' | 'seller'): number {
  const nextLevel = getNextLevel(points, type);
  return nextLevel ? nextLevel.min - points : 0;
}

export function calculatePoints(event: GamificationEvent): number {
  switch (event.type) {
    case 'purchase':
      return Math.floor(event.data.amount! * 2); // 2 points par euro dépensé
    case 'sale':
      return Math.floor(event.data.amount! * 3); // 3 points par euro gagné
    case 'review':
      return event.data.rating! * 10; // 10-50 points selon la note
    case 'delivery':
      // Plus de points pour une livraison rapide
      return event.data.deliveryTime! <= 24 ? 50 : 25;
    case 'referral':
      return 100; // Points fixes pour un parrainage
    default:
      return 0;
  }
}

export function checkAchievements(
  type: 'buyer' | 'seller',
  stats: {
    totalSpent?: number;
    totalEarned?: number;
    ordersCount: number;
    averageRating?: number;
    fastDeliveries?: number;
  }
): Achievement[] {
  const achievements = type === 'buyer' ? BUYER_ACHIEVEMENTS : SELLER_ACHIEVEMENTS;
  
  return achievements.map(achievement => {
    let progress = 0;
    
    switch (achievement.id) {
      case 'first_purchase':
      case 'first_sale':
        progress = stats.ordersCount > 0 ? 1 : 0;
        break;
      case 'big_spender':
        progress = stats.totalSpent || 0;
        break;
      case 'loyal_customer':
        progress = stats.ordersCount;
        break;
      case 'fast_delivery':
        progress = stats.fastDeliveries || 0;
        break;
      case 'perfect_rating':
        progress = stats.averageRating === 5 ? stats.ordersCount : 0;
        break;
    }

    return {
      ...achievement,
      progress,
      completed: progress >= achievement.target
    };
  });
}

// Event processing
export function processGamificationEvent(event: GamificationEvent, type: 'buyer' | 'seller'): void {
  const points = calculatePoints(event);
  
  // Sauvegarder les points dans le localStorage
  const currentPoints = parseInt(localStorage.getItem(`${type}_points`) || '0');
  const newPoints = currentPoints + points;
  localStorage.setItem(`${type}_points`, newPoints.toString());

  // Sauvegarder l'historique
  const history = JSON.parse(localStorage.getItem(`${type}_history`) || '[]');
  history.push({
    date: new Date().toISOString(),
    points,
    amount: event.data.amount || 0
  });
  localStorage.setItem(`${type}_history`, JSON.stringify(history));

  // Vérifier le changement de niveau
  const previousLevel = getCurrentLevel(currentPoints, type);
  const newLevel = getCurrentLevel(newPoints, type);

  // Sauvegarder les notifications
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  if (newLevel.name !== previousLevel.name) {
    notifications.push({
      id: crypto.randomUUID(),
      type: 'success',
      message: `Félicitations ! Vous avez atteint le niveau ${newLevel.name} !`
    });
  }

  notifications.push({
    id: crypto.randomUUID(),
    type: 'info',
    message: `+${points} points ${type === 'buyer' ? 'fidélité' : 'influence'}`
  });

  localStorage.setItem('notifications', JSON.stringify(notifications));

  // Mettre à jour les achievements
  const stats = JSON.parse(localStorage.getItem(`${type}_stats`) || '{}');
  const achievements = checkAchievements(type, stats);
  localStorage.setItem(`${type}_achievements`, JSON.stringify(achievements));
}

// Rankings
export function getRankings(platform: Platform): {
  global: any[];
  country: Record<string, any[]>;
  city: Record<string, any[]>;
} {
  // Cette fonction serait normalement connectée à une API
  // Pour l'instant, on retourne des données mockées
  return {
    global: [],
    country: {},
    city: {}
  };
}