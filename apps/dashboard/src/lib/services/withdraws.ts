import { Withdraw } from "../types/withdraws";

// Créer un nouveau compte
export async function createWithdraw(
  data: Omit<Withdraw, "id" | "createdAt">,
  userId: string
): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/withdraws/create`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ ...data, userId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create withdraw");
  }

  const result = await response.json();
  return result.id;
}

// Récupérer tous les comptes d'un utilisateur avec des filtres
export async function getWithdraws(
  filters: any
): Promise<Withdraw[]> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/withdraws`,
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
    throw new Error("Failed to fetch withdraws");
  }

  return await response.json();
}

// Récupérer un compte spécifique par ID
export async function getWithdraw(
  withdrawId: string
): Promise<Withdraw> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/withdraws/${withdrawId}`,
    {
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch withdraw with ID ${withdrawId}`);
  }

  return await response.json();
}

// Mettre à jour un compte
export async function updateWithdraw(
  withdrawId: string,
  updates: Partial<Withdraw>
): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/withdraws/${withdrawId}`,
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
    throw new Error(`Failed to update withdraw with ID ${withdrawId}`);
  }
}

// Supprimer un compte (soft delete)
export async function deleteWithdraw(withdrawId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/withdraws/${withdrawId}`,
    {
      method: "DELETE",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete withdraw with ID ${withdrawId}`);
  }
}
