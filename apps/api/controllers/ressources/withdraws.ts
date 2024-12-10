import dotenv from "dotenv";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../firebase";

dotenv.config();

// Récupérer un billing par ID
export const getById = async (billingId: string) => {
  return await getDocumentById("withdraws", billingId);
};

// Récupérer tous les billings avec des filtres optionnels
export const getAll = async (payload: any) => {
  const { filters } = payload;
  return await getDocuments("withdraws", filters);
};

export const create = async (data: any) => {
  return await createDocument("withdraws", data);
};

// Mettre à jour un billing
export const update = async (withdrawId: string, updates: any) => {
  if ("isDefault" in updates) {
    console.log("isDefault in updates");
    const withdraw = await getById(withdrawId);
    const defaultWithdraws = await getDocuments("withdraws", [
      ["userId", "==", withdraw.userId],
      ["isDefault", "==", true],
    ]);
    if (defaultWithdraws.length > 0) {
      await Promise.all(
        defaultWithdraws.map(async (withdraw) => {
          await updateDocument("withdraws", withdraw.id, {
            isDefault: false,
          });
        })
      );
    }
  }

  return await updateDocument("withdraws", withdrawId, updates);
};

// Supprimer un billing (soft delete)
export const remove = async (billingId: string) => {
  return await deleteDocument("withdraws", billingId);
};
