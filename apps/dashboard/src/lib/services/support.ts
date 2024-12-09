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

interface Ticket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  messages: {
    id: string;
    sender: 'user' | 'support';
    content: string;
    timestamp: Date;
  }[];
}

export async function createTicket(data: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'messages'>) {
  const now = Timestamp.now();
  const ticketRef = await addDoc(collection(db, 'tickets'), {
    ...data,
    status: 'open',
    createdAt: now,
    updatedAt: now,
    messages: []
  });

  return ticketRef.id;
}

export async function getTickets(userId: string) {
  const q = query(
    collection(db, 'tickets'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    messages: doc.data().messages.map((msg: any) => ({
      ...msg,
      timestamp: msg.timestamp.toDate()
    }))
  })) as Ticket[];
}

export async function addMessage(ticketId: string, message: {
  sender: 'user' | 'support';
  content: string;
}) {
  const ticketRef = doc(db, 'tickets', ticketId);
  const now = Timestamp.now();

  await updateDoc(ticketRef, {
    messages: [
      ...messages,
      {
        id: crypto.randomUUID(),
        ...message,
        timestamp: now
      }
    ],
    updatedAt: now,
    ...(message.sender === 'user' ? { status: 'in_progress' } : {})
  });
}

export async function closeTicket(ticketId: string) {
  const ticketRef = doc(db, 'tickets', ticketId);
  await updateDoc(ticketRef, {
    status: 'closed',
    updatedAt: Timestamp.now()
  });
}