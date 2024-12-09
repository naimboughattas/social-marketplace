import { Subscription } from "../types/subscriptions";

// Créer un nouveau compte
export async function createSubscription(
  data: Omit<Subscription, "id" | "createdAt">,
  userId: string
): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/subscriptions/create`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ ...data, userId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create subscription");
  }

  const result = await response.json();
  return result.id;
}

// Récupérer tous les comptes d'un utilisateur avec des filtres
export async function getSubscriptions(filters: any): Promise<Subscription[]> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/subscriptions`,
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
    throw new Error("Failed to fetch subscriptions");
  }

  return await response.json();
}

// Récupérer un compte spécifique par ID
export async function getSubscription(
  subscriptionId: string
): Promise<Subscription> {
  const response = await fetch(
    `${
      import.meta.env.VITE_NEXT_PUBLIC_API_URL
    }/subscriptions/${subscriptionId}`,
    {
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch subscription with ID ${subscriptionId}`);
  }

  return await response.json();
}

// Mettre à jour un compte
export async function updateSubscription(
  subscriptionId: string,
  updates: Partial<Subscription>
): Promise<void> {
  const response = await fetch(
    `${
      import.meta.env.VITE_NEXT_PUBLIC_API_URL
    }/subscriptions/${subscriptionId}`,
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
    throw new Error(`Failed to update subscription with ID ${subscriptionId}`);
  }
}

// Supprimer un compte (soft delete)
export async function deleteSubscription(
  subscriptionId: string
): Promise<void> {
  const response = await fetch(
    `${
      import.meta.env.VITE_NEXT_PUBLIC_API_URL
    }/subscriptions/${subscriptionId}`,
    {
      method: "DELETE",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete subscription with ID ${subscriptionId}`);
  }
}
