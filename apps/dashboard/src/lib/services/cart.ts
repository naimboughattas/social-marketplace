import { Cart } from "../types/cart";

// Créer un nouveau compte
export async function createCart(
  data: Omit<Cart, "id" | "createdAt">,
  userId: string
): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/carts/create`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ ...data, userId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create cart");
  }

  const result = await response.json();
  return result.id;
}

// Récupérer tous les comptes d'un utilisateur avec des filtres
export async function getCarts(filters: any): Promise<SocialCart[]> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/carts`,
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
    throw new Error("Failed to fetch carts");
  }

  return await response.json();
}

// Récupérer un compte spécifique par ID
export async function getCart(cartId: string): Promise<SocialCart> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/carts/${cartId}`,
    {
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch cart with ID ${cartId}`);
  }

  return await response.json();
}

// Mettre à jour un compte
export async function updateCart(
  cartId: string,
  updates: Partial<SocialCart>
): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/carts/${cartId}`,
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
    throw new Error(`Failed to update cart with ID ${cartId}`);
  }
}

// Supprimer un compte (soft delete)
export async function deleteCart(cartId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/carts/${cartId}`,
    {
      method: "DELETE",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete cart with ID ${cartId}`);
  }
}
