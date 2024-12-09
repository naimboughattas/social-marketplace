import { Service } from "../types";

export interface Order {
  id: string;
  userId: string;
  influencerId: string;
  service: Service;
  target: string;
  price: number;
  status:
    | "pending"
    | "accepted"
    | "delivered"
    | "completed"
    | "disputed"
    | "cancelled";
  createdAt: Date;
  acceptedAt?: Date;
  deliveredAt?: Date;
  completedAt?: Date;
  disputeReason?: string;
}

// Créer une nouvelle commande
export async function createOrder(
  data: Omit<Order, "id" | "createdAt" | "status">
): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/orders/create`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        ...data,
        status: "pending",
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  const result = await response.json();
  const orderId = result.id;

  // Mise à jour du solde de l'utilisateur
  const userUpdateResponse = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/users/${
      data.userId
    }/updateBalance`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        amount: -data.price,
      }),
    }
  );

  if (!userUpdateResponse.ok) {
    throw new Error("Failed to update user balance");
  }

  return orderId;
}

// Récupérer toutes les commandes d'un utilisateur
export async function getOrders(filters: any): Promise<Order[]> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/orders`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(filters),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const result = await response.json();
  return result.orders.map((doc: any) => ({
    id: doc.id,
    ...doc,
    createdAt: new Date(doc.createdAt),
    acceptedAt: doc.acceptedAt ? new Date(doc.acceptedAt) : undefined,
    deliveredAt: doc.deliveredAt ? new Date(doc.deliveredAt) : undefined,
    completedAt: doc.completedAt ? new Date(doc.completedAt) : undefined,
  })) as Order[];
}

// Accepter une commande
export async function acceptOrder(orderId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/orders/${orderId}`,
    {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        status: "accepted",
        acceptedAt: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to accept order ${orderId}`);
  }
}

// Livrer une commande
export async function deliverOrder(orderId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/orders/${orderId}`,
    {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        status: "delivered",
        deliveredAt: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to deliver order ${orderId}`);
  }
}

// Compléter une commande
export async function completeOrder(orderId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/orders/${orderId}`,
    {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        status: "completed",
        completedAt: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to complete order ${orderId}`);
  }

  // Récupération des détails de la commande pour calculer les gains de l'influenceur
  const orderResponse = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/orders/${orderId}`,
    {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }
  );

  if (!orderResponse.ok) {
    throw new Error(`Failed to fetch order ${orderId} details`);
  }

  const orderData = await orderResponse.json();

  // Mise à jour du solde de l'influenceur
  const influencerUpdateResponse = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/users/${
      orderData.influencerId
    }/updatePendingBalance`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        amount: orderData.price * 0.85,
      }),
    }
  );

  if (!influencerUpdateResponse.ok) {
    throw new Error(
      `Failed to update influencer ${orderData.influencerId} balance`
    );
  }
}

// Disputée une commande
export async function disputeOrder(
  orderId: string,
  reason: string
): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/orders/${orderId}`,
    {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        disputeReason: reason,
        status: "disputed",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to dispute order ${orderId}`);
  }
}

// Annuler une commande
export async function cancelOrder(orderId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/orders/${orderId}`,
    {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        status: "cancelled",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to cancel order ${orderId}`);
  }

  // Récupération des détails de la commande pour rembourser l'utilisateur
  const orderResponse = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/orders/${orderId}`,
    {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }
  );

  if (!orderResponse.ok) {
    throw new Error(`Failed to fetch order ${orderId} details`);
  }

  const orderData = await orderResponse.json();

  // Rembourser l'utilisateur
  const userUpdateResponse = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/users/${
      orderData.userId
    }/updateBalance`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        amount: orderData.price,
      }),
    }
  );

  if (!userUpdateResponse.ok) {
    throw new Error(`Failed to refund user ${orderData.userId}`);
  }
}
