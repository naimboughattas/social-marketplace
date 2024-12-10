import dotenv from "dotenv";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";
import { Account } from "../oauth/types";

dotenv.config();

// Récupérer un campaign par ID
export const getById = async (campaignId: string) => {
  return await getDocumentById("campaigns", campaignId);
};

// Récupérer tous les campaigns avec des filtres optionnels
export const getAll = async (payload: any) => {
  const { userId, filters } = payload;
  const accounts = (
    await getDocuments<Account>("accounts", [["userId", "==", userId]])
  ).map((account) => account.id);
  if (!accounts.length) return [];
  return await getDocuments("campaigns", [
    ...filters,
    userId && ["target", "in", accounts],
  ]);
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
