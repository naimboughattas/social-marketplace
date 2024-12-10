import { PaymentMethod } from "../types/paymentMethods";

// Créer un nouveau compte
export async function createPaymentMethod(
  data: Omit<PaymentMethod, "id" | "createdAt">,
  userId: string
): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/paymentMethods/create`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ ...data, userId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create paymentMethod");
  }

  const result = await response.json();
  return result.id;
}

// Récupérer tous les comptes d'un utilisateur avec des filtres
export async function getPaymentMethods(filters: any): Promise<PaymentMethod[]> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/paymentMethods`,
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
    throw new Error("Failed to fetch paymentMethods");
  }

  return await response.json();
}

// Récupérer un compte spécifique par ID
export async function getPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/paymentMethods/${paymentMethodId}`,
    {
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch paymentMethod with ID ${paymentMethodId}`);
  }

  return await response.json();
}

// Mettre à jour un compte
export async function updatePaymentMethod(
  paymentMethodId: string,
  updates: Partial<PaymentMethod>
): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/paymentMethods/${paymentMethodId}`,
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
    throw new Error(`Failed to update paymentMethod with ID ${paymentMethodId}`);
  }
}

// Supprimer un compte (soft delete)
export async function deletePaymentMethod(paymentMethodId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/paymentMethods/${paymentMethodId}`,
    {
      method: "DELETE",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete paymentMethod with ID ${paymentMethodId}`);
  }
}
