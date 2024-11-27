import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { NotificationType } from '../types/notifications';

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, any>;
  link?: string;
}

export async function createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<string> {
  const notificationRef = await addDoc(collection(db, 'notifications'), {
    ...data,
    isRead: false,
    createdAt: Timestamp.now()
  });

  return notificationRef.id;
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as Notification[];
}

export async function markAsRead(notificationId: string): Promise<void> {
  await updateDoc(doc(db, 'notifications', notificationId), {
    isRead: true
  });
}

export async function markAllAsRead(userId: string): Promise<void> {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('isRead', '==', false)
  );

  const snapshot = await getDocs(q);
  const batch = writeBatch(db);

  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { isRead: true });
  });

  await batch.commit();
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await updateDoc(doc(db, 'notifications', notificationId), {
    deleted: true,
    deletedAt: Timestamp.now()
  });
}