import dotenv from "dotenv";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";
import { Account } from "../oauth/types";

dotenv.config();

// Récupérer un order par ID
export const getById = async (orderId: string) => {
  return await getDocumentById("orders", orderId);
};

// Récupérer tous les orders avec des filtres optionnels
export const getAll = async (payload: any) => {
  const { userId, filters } = payload;
  const accounts = (
    await getDocuments<Account>("accounts", [["userId", "==", userId]])
  ).map((account) => account.id);
  if (!accounts.length) return [];
  return await getDocuments("orders", [
    ...filters,
    userId && ["target", "in", accounts],
  ]);
};

// Mettre à jour un order
export const update = async (orderId: string, updates: any) => {
  return await updateDocument("orders", orderId, updates);
};

// Supprimer un order (soft delete)
export const remove = async (orderId: string) => {
  return await deleteDocument("orders", orderId);
};
