import dotenv from "dotenv";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

// Récupérer un invoice par ID
export const getById = async (invoiceId: string) => {
  return await getDocumentById("invoices", invoiceId);
};

// Récupérer tous les invoices avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("invoices", filters);
};

// Mettre à jour un invoice
export const update = async (invoiceId: string, updates: any) => {
  return await updateDocument("invoices", invoiceId, updates);
};

// Supprimer un invoice (soft delete)
export const remove = async (invoiceId: string) => {
  return await deleteDocument("invoices", invoiceId);
};
