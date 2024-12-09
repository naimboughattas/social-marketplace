import dotenv from "dotenv";
import { User } from "../types";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

export const getById = async (userId: string) => {
  return await getDocumentById("users", userId);
};

export const getAll = async (filters: any[]) => {
  // Exemple: Utiliser des filtres comme [["isActive", "==", true]]
  return await getDocuments("users", filters);
};

export const update = async (userId: string, updates: Partial<User>) => {
  return await updateDocument("users", userId, updates);
};

export const remove = async (userId: string) => {
  return await deleteDocument("users", userId);
};
