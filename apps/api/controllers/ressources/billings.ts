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
  return await getDocumentById("billingProfiles", billingId);
};

// Récupérer tous les billings avec des filtres optionnels
export const getAll = async (payload: any) => {
  const { filters } = payload;
  return await getDocuments("billingProfiles", filters);
};

export const create = async (data: any) => {
  return await createDocument("billingProfiles", data);
};

// Mettre à jour un billing
export const update = async (billingId: string, updates: any) => {
  if ("isDefault" in updates) {
    console.log("isDefault in updates");
    const billing = await getById(billingId);
    const defaultBillings = await getDocuments("billingProfiles", [
      ["userId", "==", billing.userId],
      ["isDefault", "==", true],
    ]);
    if (defaultBillings.length > 0) {
      await Promise.all(
        defaultBillings.map(async (billing) => {
          await updateDocument("billingProfiles", billing.id, {
            isDefault: false,
          });
        })
      );
    }
  }

  return await updateDocument("billingProfiles", billingId, updates);
};

// Supprimer un billing (soft delete)
export const remove = async (billingId: string) => {
  return await deleteDocument("billingProfiles", billingId);
};
