import dotenv from "dotenv";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

// Récupérer un proposal par ID
export const getById = async (proposalId: string) => {
  return await getDocumentById("proposals", proposalId);
};

// Récupérer tous les proposals avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("proposals", filters);
};

// Mettre à jour un proposal
export const update = async (proposalId: string, updates: any) => {
  return await updateDocument("proposals", proposalId, updates);
};

// Supprimer un proposal (soft delete)
export const remove = async (proposalId: string) => {
  return await deleteDocument("proposals", proposalId);
};
