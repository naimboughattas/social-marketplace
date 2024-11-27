import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { SocialAccount, Service } from '../types';

export async function getInfluencers(filters?: {
  platform?: string;
  category?: string;
  country?: string;
  language?: string;
  minFollowers?: number;
  maxFollowers?: number;
  services?: Service[];
  isVerified?: boolean;
}) {
  let q = query(
    collection(db, 'socialAccounts'),
    where('isActive', '==', true)
  );

  if (filters) {
    if (filters.platform) {
      q = query(q, where('platform', '==', filters.platform));
    }
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.country) {
      q = query(q, where('country', '==', filters.country));
    }
    if (filters.language) {
      q = query(q, where('language', '==', filters.language));
    }
    if (filters.isVerified !== undefined) {
      q = query(q, where('isVerified', '==', filters.isVerified));
    }
    if (filters.services && filters.services.length > 0) {
      q = query(q, where('availableServices', 'array-contains-any', filters.services));
    }
  }

  const snapshot = await getDocs(q);
  let influencers = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SocialAccount[];

  // Apply follower filters after fetching
  if (filters?.minFollowers !== undefined) {
    influencers = influencers.filter(inf => inf.followers >= filters.minFollowers!);
  }
  if (filters?.maxFollowers !== undefined) {
    influencers = influencers.filter(inf => inf.followers <= filters.maxFollowers!);
  }

  return influencers;
}

export async function getInfluencer(id: string) {
  const docRef = doc(db, 'influencers', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Influencer not found');
  }

  return {
    id: docSnap.id,
    ...docSnap.data()
  } as SocialAccount;
}

export async function updateInfluencerStats(influencerId: string, updates: {
  completedOrders?: number;
  rating?: number;
  totalEarnings?: number;
}) {
  const docRef = doc(db, 'influencers', influencerId);

  const updateData: any = {};
  if (updates.completedOrders !== undefined) {
    updateData.completedOrders = increment(updates.completedOrders);
  }
  if (updates.rating !== undefined) {
    updateData.rating = updates.rating;
  }
  if (updates.totalEarnings !== undefined) {
    updateData.totalEarnings = increment(updates.totalEarnings);
  }

  await updateDoc(docRef, updateData);
}

export async function updateInfluencerServices(influencerId: string, services: {
  service: Service;
  price: number;
  isActive: boolean;
}[]) {
  const docRef = doc(db, 'influencers', influencerId);
  
  const prices: Record<Service, number> = {};
  const availableServices: Service[] = [];

  services.forEach(({ service, price, isActive }) => {
    if (isActive) {
      prices[service] = price;
      availableServices.push(service);
    }
  });

  await updateDoc(docRef, {
    prices,
    availableServices,
    updatedAt: Timestamp.now()
  });
}

export async function getTopInfluencers(platform: string, limit = 10) {
  const q = query(
    collection(db, 'influencers'),
    where('platform', '==', platform),
    where('isVerified', '==', true),
    orderBy('rating', 'desc'),
    orderBy('completedOrders', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.slice(0, limit).map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SocialAccount[];
}

export async function searchInfluencers(searchTerm: string) {
  // Search by username or displayName
  const q = query(
    collection(db, 'influencers'),
    where('searchTerms', 'array-contains', searchTerm.toLowerCase())
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SocialAccount[];
}