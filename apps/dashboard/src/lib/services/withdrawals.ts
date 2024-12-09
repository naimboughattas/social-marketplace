import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

interface WithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  method: 'bank' | 'paypal';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  methodId: string;
  billingProfileId: string;
  createdAt: Date;
  completedAt?: Date;
}

export async function createWithdrawRequest(data: Omit<WithdrawRequest, 'id' | 'status' | 'createdAt'>) {
  const withdrawRef = await addDoc(collection(db, 'withdrawals'), {
    ...data,
    status: 'pending',
    createdAt: Timestamp.now()
  });

  // Update user's pending balance
  await updateDoc(doc(db, 'users', data.userId), {
    pendingBalance: {
      increment: -data.amount
    }
  });

  return withdrawRef.id;
}

export async function getWithdrawRequests(userId: string) {
  const q = query(
    collection(db, 'withdrawals'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    completedAt: doc.data().completedAt?.toDate()
  })) as WithdrawRequest[];
}

export async function cancelWithdrawRequest(requestId: string, userId: string) {
  const withdrawRef = doc(db, 'withdrawals', requestId);
  const withdrawDoc = await getDocs(withdrawRef);
  const withdrawData = withdrawDoc.data();

  if (!withdrawData || withdrawData.status !== 'pending') {
    throw new Error('Invalid withdrawal request');
  }

  // Update withdrawal status
  await updateDoc(withdrawRef, {
    status: 'cancelled',
    cancelledAt: Timestamp.now()
  });

  // Restore user's pending balance
  await updateDoc(doc(db, 'users', userId), {
    pendingBalance: {
      increment: withdrawData.amount
    }
  });
}