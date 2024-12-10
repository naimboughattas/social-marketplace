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
  return await getDocumentById("disputes", ticketId);
};

// Récupérer tous les disputes avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("disputes", filters);
};

export const create = async (data: any) => {
  return await createDocument("disputes", data);
};

// Mettre à jour un ticket
export const update = async (ticketId: string, updates: any) => {
  console.log("Updating ticket", updates);
  return await updateDocument("disputes", ticketId, updates);
};

// Supprimer un ticket (soft delete)
export const remove = async (ticketId: string) => {
  return await deleteDocument("disputes", ticketId);
};
