import { BillingProfile } from "../types/billingProfiles";

// Créer un nouveau compte
export async function createBillingProfile(
  data: Omit<BillingProfile, "id" | "createdAt">,
  userId: string
): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/billings/create`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ ...data, userId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create billing");
  }

  const result = await response.json();
  return result.id;
}

// Récupérer tous les comptes d'un utilisateur avec des filtres
export async function getBillingProfiles(
  filters: any
): Promise<BillingProfile[]> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/billings`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      }),
      body: JSON.stringify({ filters }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch billings");
  }

  return await response.json();
}

// Récupérer un compte spécifique par ID
export async function getBillingProfile(
  billingId: string
): Promise<BillingProfile> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/billings/${billingId}`,
    {
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch billing with ID ${billingId}`);
  }

  return await response.json();
}

// Mettre à jour un compte
export async function updateBillingProfile(
  billingId: string,
  updates: Partial<BillingProfile>
): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/billings/${billingId}`,
    {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      }),
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to update billing with ID ${billingId}`);
  }
}

// Supprimer un compte (soft delete)
export async function deleteBillingProfile(billingId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/billings/${billingId}`,
    {
      method: "DELETE",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete billing with ID ${billingId}`);
  }
}
