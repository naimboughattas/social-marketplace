import dotenv from "dotenv";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

// Récupérer un campaign par ID
export const getById = async (campaignId: string) => {
  return await getDocumentById("campaigns", campaignId);
};

// Récupérer tous les campaigns avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("campaigns", filters);
};

export const create = async (data: any) => {
  return await createDocument("campaigns", data);
};

// Mettre à jour un campaign
export const update = async (campaignId: string, updates: any) => {
  return await updateDocument("campaigns", campaignId, updates);
};

// Supprimer un campaign (soft delete)
export const remove = async (campaignId: string) => {
  return await deleteDocument("campaigns", campaignId);
};
