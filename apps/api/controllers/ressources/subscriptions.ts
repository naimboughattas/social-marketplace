import dotenv from "dotenv";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";
import { Account } from "../oauth/types";

dotenv.config();

// Récupérer un subscription par ID
export const getById = async (subscriptionId: string) => {
  return await getDocumentById("subscriptions", subscriptionId);
};

// Récupérer tous les subscriptions avec des filtres optionnels
export const getAll = async (payload: any) => {
  const { type, userId, filters } = payload;
  if (!type) return await getDocuments("subscriptions", filters);
  const accounts = (
    await getDocuments<Account>("accounts", [["userId", "==", userId]])
  ).map((account) => account.id);
  if (!accounts.length) return [];
  if (type === "customer")
    return await getDocuments("subscriptions", [["client.id", "in", accounts]]);
  if (type === "influencer")
    return await getDocuments("subscriptions", [
      ["influencer.id", "in", accounts],
    ]);
};

// Mettre à jour un subscription
export const update = async (subscriptionId: string, updates: any) => {
  return await updateDocument("subscriptions", subscriptionId, updates);
};

// Supprimer un subscription (soft delete)
export const remove = async (subscriptionId: string) => {
  return await deleteDocument("subscriptions", subscriptionId);
};
