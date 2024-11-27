import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { Service } from '../types';

interface Proposal {
  id: string;
  userId: string;
  influencerId: string;
  service: Service;
  target: string;
  price: number;
  status: 'pending' | 'accepted' | 'delivered' | 'completed' | 'refused';
  createdAt: Date;
  acceptedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  refusalReason?: string;
}

export async function createProposal(data: Omit<Proposal, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const proposalRef = await addDoc(collection(db, 'proposals'), {
    ...data,
    status: 'pending',
    createdAt: Timestamp.now()
  });

  return proposalRef.id;
}

export async function getProposals(userId: string, role: 'business' | 'influencer'): Promise<Proposal[]> {
  const field = role === 'business' ? 'userId' : 'influencerId';
  
  const q = query(
    collection(db, 'proposals'),
    where(field, '==', userId),
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
  })) as Proposal[];
}

export async function acceptProposal(proposalId: string): Promise<void> {
  await updateDoc(doc(db, 'proposals', proposalId), {
    status: 'accepted',
    acceptedAt: Timestamp.now()
  });
}

export async function deliverProposal(proposalId: string): Promise<void> {
  await updateDoc(doc(db, 'proposals', proposalId), {
    status: 'delivered',
    deliveredAt: Timestamp.now()
  });
}

export async function completeProposal(proposalId: string): Promise<void> {
  await updateDoc(doc(db, 'proposals', proposalId), {
    status: 'completed',
    completedAt: Timestamp.now()
  });
}

export async function refuseProposal(proposalId: string, reason: string): Promise<void> {
  await updateDoc(doc(db, 'proposals', proposalId), {
    status: 'refused',
    refusalReason: reason
  });
}