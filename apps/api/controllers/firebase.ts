// firebase.ts
import { db } from "../lib/firebase";
import {
  collection,
  where,
  getDocs,
  query,
  updateDoc,
  doc,
  getDoc,
  DocumentSnapshot,
  addDoc,
} from "firebase/firestore";

// Helper pour transformer les documents Firebase en objets utilisables
const mapDocToObject = <T>(docSnap: DocumentSnapshot): T => {
  if (!docSnap.exists()) throw new Error("Document not found");
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as T;
};

// CRUD Général

export const createDocument = async <T>(
  collectionName: string,
  data: T
): Promise<{ id: string; success: boolean }> => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: Date.now(), // Ajoute un timestamp pour le suivi de création
      updatedAt: Date.now(),
      deletedAt: null,
    });
    console.log(`Document created in ${collectionName} with ID: ${docRef.id}`);
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

// Lire un document par ID
export const getDocumentById = async <T>(
  collectionName: string,
  docId: string
): Promise<T> => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    return mapDocToObject<T>(docSnap);
  } catch (error) {
    console.error(`Error fetching document ${collectionName}/${docId}:`, error);
    throw error;
  }
};

// Lire plusieurs documents avec des filtres
export const getDocuments = async <T>(
  collectionName: string,
  filters: any[] = []
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = filters.length
      ? query(
          collectionRef,
          ...filters.map((f) => where(f[0], f[1], f[2])),
          where("deletedAt", "==", null),
        )
      : query(collectionRef, where("deletedAt", "==", null));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((docSnap) => mapDocToObject<T>(docSnap));
  } catch (error) {
    console.error(`Error fetching documents from ${collectionName}:`, error);
    throw error;
  }
};

// Mettre à jour un document
export const updateDocument = async <T>(
  collectionName: string,
  docId: string,
  updates: Partial<T>
): Promise<{ success: boolean }> => {
  try {
    await updateDoc(doc(db, collectionName, docId), updates);
    return { success: true };
  } catch (error) {
    console.error(`Error updating document ${collectionName}/${docId}:`, error);
    throw error;
  }
};

// Supprimer (ou désactiver) un document
export const deleteDocument = async (
  collectionName: string,
  docId: string,
  softDelete: boolean = true
): Promise<{ success: boolean }> => {
  try {
    if (softDelete) {
      // Mise à jour de champ isActive ou équivalent pour un "soft delete"
      await updateDoc(doc(db, collectionName, docId), {
        deletedAt: Date.now(),
      });
    } else {
      // Pour un "hard delete", ajouter la logique ici si besoin
    }
    return { success: true };
  } catch (error) {
    console.error(`Error deleting document ${collectionName}/${docId}:`, error);
    throw error;
  }
};

// Fonction personnalisée pour un sous-groupe (exemple: SocialAccounts)
export const getRelatedDocuments = async <T>(
  collectionName: string,
  relationField: string,
  relationValue: any
): Promise<T[]> => {
  try {
    return await getDocuments<T>(collectionName, [
      [relationField, "==", relationValue],
    ]);
  } catch (error) {
    console.error(
      `Error fetching related documents in ${collectionName}:`,
      error
    );
    throw error;
  }
};
