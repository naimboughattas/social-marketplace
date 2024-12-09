import dotenv from "dotenv";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

// Récupérer un order par ID
export const getById = async (orderId: string) => {
  return await getDocumentById("orders", orderId);
};

// Récupérer tous les orders avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("orders", filters);
};

// Mettre à jour un order
export const update = async (orderId: string, updates: any) => {
  return await updateDocument("orders", orderId, updates);
};

// Supprimer un order (soft delete)
export const remove = async (orderId: string) => {
  return await deleteDocument("orders", orderId);
};
