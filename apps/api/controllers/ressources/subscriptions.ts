import dotenv from "dotenv";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

// Récupérer un subscription par ID
export const getById = async (subscriptionId: string) => {
  return await getDocumentById("subscriptions", subscriptionId);
};

// Récupérer tous les subscriptions avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("subscriptions", filters);
};

// Mettre à jour un subscription
export const update = async (subscriptionId: string, updates: any) => {
  return await updateDocument("subscriptions", subscriptionId, updates);
};

// Supprimer un subscription (soft delete)
export const remove = async (subscriptionId: string) => {
  return await deleteDocument("subscriptions", subscriptionId);
};
