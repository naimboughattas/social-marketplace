import dotenv from "dotenv";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

// Récupérer un review par ID
export const getById = async (reviewId: string) => {
  return await getDocumentById("reviews", reviewId);
};

// Récupérer tous les reviews avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("reviews", filters);
};

// Mettre à jour un review
export const update = async (reviewId: string, updates: any) => {
  return await updateDocument("reviews", reviewId, updates);
};

// Supprimer un review (soft delete)
export const remove = async (reviewId: string) => {
  return await deleteDocument("reviews", reviewId);
};
