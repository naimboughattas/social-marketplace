import { Dispute } from "../types/disputes";

// Créer un nouveau compte
export async function createDispute(
  data: Omit<Dispute, "id" | "createdAt">,
  userId: string
): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/disputes/create`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ ...data, userId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create dispute");
  }

  const result = await response.json();
  return result.id;
}

// Récupérer tous les comptes d'un utilisateur avec des filtres
export async function getDisputes(filters: any): Promise<Dispute[]> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/disputes`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      }),
      body: JSON.stringify(filters),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch disputes");
  }

  return await response.json();
}

// Récupérer un compte spécifique par ID
export async function getDispute(disputeId: string): Promise<Dispute> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/disputes/${disputeId}`,
    {
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch dispute with ID ${disputeId}`);
  }

  return await response.json();
}

// Mettre à jour un compte
export async function updateDispute(
  disputeId: string,
  updates: Partial<Dispute>
): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/disputes/${disputeId}`,
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
    throw new Error(`Failed to update dispute with ID ${disputeId}`);
  }
}

// Supprimer un compte (soft delete)
export async function deleteDispute(disputeId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/disputes/${disputeId}`,
    {
      method: "DELETE",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete dispute with ID ${disputeId}`);
  }
}
