import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

interface Payment {
  id: string;
  userId: string;
  amount: number;
  method: 'card' | 'bank' | 'paypal';
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  createdAt: Date;
  completedAt?: Date;
}

interface WithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  method: 'bank' | 'paypal';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: Date;
  completedAt?: Date;
}

export async function createPayment(data: Omit<Payment, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const paymentRef = await addDoc(collection(db, 'payments'), {
    ...data,
    status: 'pending',
    createdAt: Timestamp.now()
  });

  return paymentRef.id;
}

export async function confirmPayment(paymentId: string): Promise<void> {
  const paymentRef = doc(db, 'payments', paymentId);
  const paymentDoc = await getDocs(paymentRef);
  const paymentData = paymentDoc.data();

  if (!paymentData) throw new Error('Payment not found');

  // Update payment status
  await updateDoc(paymentRef, {
    status: 'completed',
    completedAt: Timestamp.now()
  });

  // Add amount to user balance
  await updateDoc(doc(db, 'users', paymentData.userId), {
    balance: increment(paymentData.amount)
  });
}

export async function createWithdrawRequest(data: Omit<WithdrawRequest, 'id' | 'createdAt' | 'status'>): Promise<string> {
  // Verify user has sufficient pending balance
  const userRef = doc(db, 'users', data.userId);
  const userDoc = await getDocs(userRef);
  const userData = userDoc.data();

  if (!userData || userData.pendingBalance < data.amount) {
    throw new Error('Insufficient pending balance');
  }

  // Create withdraw request
  const withdrawRef = await addDoc(collection(db, 'withdraws'), {
    ...data,
    status: 'pending',
    createdAt: Timestamp.now()
  });

  // Reduce pending balance
  await updateDoc(userRef, {
    pendingBalance: increment(-data.amount)
  });

  return withdrawRef.id;
}

export async function getWithdrawRequests(userId: string): Promise<WithdrawRequest[]> {
  const q = query(
    collection(db, 'withdraws'),
    where('userId', '==', userId),
    where('status', '!=', 'rejected')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    completedAt: doc.data().completedAt?.toDate()
  })) as WithdrawRequest[];
}