import dotenv from "dotenv";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

// Récupérer un payment par ID
export const getById = async (paymentId: string) => {
  return await getDocumentById("paymentMethods", paymentId);
};

// Récupérer tous les paymentMethods avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("paymentMethods", filters);
};

// Mettre à jour un payment
export const update = async (paymentId: string, updates: any) => {
  return await updateDocument("paymentMethods", paymentId, updates);
};

// Supprimer un payment (soft delete)
export const remove = async (paymentId: string) => {
  return await deleteDocument("paymentMethods", paymentId);
};
