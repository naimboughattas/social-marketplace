import dotenv from "dotenv";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

// Récupérer un retrait par ID
export const getById = async (withdrawalId: string) => {
  return await getDocumentById("withdrawals", withdrawalId);
};

// Récupérer tous les retraits avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("withdrawals", filters);
};

// Mettre à jour un retrait
export const update = async (withdrawalId: string, updates: any) => {
  return await updateDocument("withdrawals", withdrawalId, updates);
};

// Supprimer un retrait (soft delete)
export const remove = async (withdrawalId: string) => {
  return await deleteDocument("withdrawals", withdrawalId);
};
