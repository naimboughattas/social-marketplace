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
  return await getDocumentById("payments", paymentId);
};

// Récupérer tous les payments avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("payments", filters);
};

// Mettre à jour un payment
export const update = async (paymentId: string, updates: any) => {
  return await updateDocument("payments", paymentId, updates);
};

// Supprimer un payment (soft delete)
export const remove = async (paymentId: string) => {
  return await deleteDocument("payments", paymentId);
};
