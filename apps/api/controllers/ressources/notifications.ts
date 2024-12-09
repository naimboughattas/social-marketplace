import dotenv from "dotenv";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

// Récupérer un notification par ID
export const getById = async (notificationId: string) => {
  return await getDocumentById("notifications", notificationId);
};

// Récupérer tous les notifications avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("notifications", filters);
};

// Mettre à jour un notification
export const update = async (notificationId: string, updates: any) => {
  return await updateDocument("notifications", notificationId, updates);
};

// Supprimer un notification (soft delete)
export const remove = async (notificationId: string) => {
  return await deleteDocument("notifications", notificationId);
};
