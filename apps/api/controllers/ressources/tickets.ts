import dotenv from "dotenv";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

// Récupérer un ticket par ID
export const getById = async (ticketId: string) => {
  return await getDocumentById("tickets", ticketId);
};

// Récupérer tous les tickets avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("tickets", filters);
};

export const create = async (data: any) => {
  return await createDocument("tickets", data);
};

// Mettre à jour un ticket
export const update = async (ticketId: string, updates: any) => {
  return await updateDocument("tickets", ticketId, updates);
};

// Supprimer un ticket (soft delete)
export const remove = async (ticketId: string) => {
  return await deleteDocument("tickets", ticketId);
};
