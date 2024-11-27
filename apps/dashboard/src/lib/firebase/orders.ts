import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  increment,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { Service } from '../types';

export interface Order {
  id: string;
  userId: string;
  influencerId: string;
  service: Service;
  target: string;
  price: number;
  status: 'pending' | 'accepted' | 'delivered' | 'completed' | 'disputed' | 'cancelled';
  createdAt: Date;
  acceptedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  disputeReason?: string;
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const orderRef = await addDoc(collection(db, 'orders'), {
    ...data,
    status: 'pending',
    createdAt: Timestamp.now()
  });

  // Update user balance
  await updateDoc(doc(db, 'users', data.userId), {
    balance: increment(-data.price)
  });

  return orderRef.id;
}

export async function getOrders(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    acceptedAt: doc.data().acceptedAt?.toDate(),
    deliveredAt: doc.data().deliveredAt?.toDate(),
    completedAt: doc.data().completedAt?.toDate()
  })) as Order[];
}

export async function acceptOrder(orderId: string): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), {
    status: 'accepted',
    acceptedAt: Timestamp.now()
  });
}

export async function deliverOrder(orderId: string): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), {
    status: 'delivered',
    deliveredAt: Timestamp.now()
  });
}

export async function completeOrder(orderId: string): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  const orderDoc = await getDocs(orderRef);
  const orderData = orderDoc.data();

  if (!orderData) throw new Error('Order not found');

  // Update order status
  await updateDoc(orderRef, {
    status: 'completed',
    completedAt: Timestamp.now()
  });

  // Add earnings to influencer's pending balance (85% of order price)
  await updateDoc(doc(db, 'users', orderData.influencerId), {
    pendingBalance: increment(orderData.price * 0.85)
  });
}

export async function disputeOrder(orderId: string, reason: string): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), {
    status: 'disputed',
    disputeReason: reason
  });
}

export async function cancelOrder(orderId: string): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  const orderDoc = await getDocs(orderRef);
  const orderData = orderDoc.data();

  if (!orderData) throw new Error('Order not found');

  // Update order status
  await updateDoc(orderRef, {
    status: 'cancelled'
  });

  // Refund user
  await updateDoc(doc(db, 'users', orderData.userId), {
    balance: increment(orderData.price)
  });
}