import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';

interface Stats {
  userId: string;
  type: 'order' | 'earning' | 'follower' | 'engagement';
  value: number;
  date: Date;
}

export async function addStats(data: Omit<Stats, 'date'>) {
  await addDoc(collection(db, 'stats'), {
    ...data,
    date: Timestamp.now()
  });
}

export async function getDailyStats(userId: string, type: Stats['type'], days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const q = query(
    collection(db, 'stats'),
    where('userId', '==', userId),
    where('type', '==', type),
    where('date', '>=', Timestamp.fromDate(startDate)),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate()
  }));
}

export async function getMonthlyStats(userId: string, type: Stats['type']) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);

  const q = query(
    collection(db, 'stats'),
    where('userId', '==', userId),
    where('type', '==', type),
    where('date', '>=', Timestamp.fromDate(startDate)),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate()
  }));
}

export async function getAggregatedStats(userId: string) {
  const q = query(
    collection(db, 'stats'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  const stats = snapshot.docs.map(doc => ({
    ...doc.data(),
    date: doc.data().date.toDate()
  }));

  return {
    totalOrders: stats.filter(s => s.type === 'order').length,
    totalEarnings: stats.filter(s => s.type === 'earning')
      .reduce((sum, stat) => sum + stat.value, 0),
    totalFollowers: stats.filter(s => s.type === 'follower')
      .reduce((sum, stat) => sum + stat.value, 0),
    averageEngagement: stats.filter(s => s.type === 'engagement')
      .reduce((sum, stat) => sum + stat.value, 0) / stats.length || 0
  };
}