import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

interface Review {
  id: string;
  orderId: string;
  userId: string;
  influencerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export async function createReview(data: Omit<Review, 'id' | 'createdAt'>) {
  const reviewRef = await addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: Timestamp.now()
  });

  return reviewRef.id;
}

export async function getInfluencerReviews(influencerId: string) {
  const q = query(
    collection(db, 'reviews'),
    where('influencerId', '==', influencerId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as Review[];
}

export async function getUserReviews(userId: string) {
  const q = query(
    collection(db, 'reviews'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as Review[];
}