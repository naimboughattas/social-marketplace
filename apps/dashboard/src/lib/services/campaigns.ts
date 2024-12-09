import { Service } from "../types";

export interface Campaign {
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
export async function createCampaign(
  data: Omit<Campaign, "id" | "createdAt" | "status">
): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/campaigns/create`,
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
    throw new Error("Failed to create campaign");
  }

  const result = await response.json();
  const campaignId = result.id;

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

  return campaignId;
}

// Récupérer toutes les commandes d'un utilisateur
export async function getCampaigns(filters: any): Promise<Campaign[]> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/campaigns`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(filters),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch campaigns");
  }

  const result = await response.json();
  return result.campaigns.map((doc: any) => ({
    id: doc.id,
    ...doc,
    createdAt: new Date(doc.createdAt),
    acceptedAt: doc.acceptedAt ? new Date(doc.acceptedAt) : undefined,
    deliveredAt: doc.deliveredAt ? new Date(doc.deliveredAt) : undefined,
    completedAt: doc.completedAt ? new Date(doc.completedAt) : undefined,
  })) as Campaign[];
}

// Accepter une commande
export async function acceptCampaign(campaignId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/campaigns/${campaignId}`,
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
    throw new Error(`Failed to accept campaign ${campaignId}`);
  }
}

// Livrer une commande
export async function deliverCampaign(campaignId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/campaigns/${campaignId}`,
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
    throw new Error(`Failed to deliver campaign ${campaignId}`);
  }
}

// Compléter une commande
export async function completeCampaign(campaignId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/campaigns/${campaignId}`,
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
    throw new Error(`Failed to complete campaign ${campaignId}`);
  }

  // Récupération des détails de la commande pour calculer les gains de l'influenceur
  const campaignResponse = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/campaigns/${campaignId}`,
    {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }
  );

  if (!campaignResponse.ok) {
    throw new Error(`Failed to fetch campaign ${campaignId} details`);
  }

  const campaignData = await campaignResponse.json();

  // Mise à jour du solde de l'influenceur
  const influencerUpdateResponse = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/users/${
      campaignData.influencerId
    }/updatePendingBalance`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        amount: campaignData.price * 0.85,
      }),
    }
  );

  if (!influencerUpdateResponse.ok) {
    throw new Error(
      `Failed to update influencer ${campaignData.influencerId} balance`
    );
  }
}

// Disputée une commande
export async function disputeCampaign(
  campaignId: string,
  reason: string
): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/campaigns/${campaignId}`,
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
    throw new Error(`Failed to dispute campaign ${campaignId}`);
  }
}

// Annuler une commande
export async function cancelCampaign(campaignId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/campaigns/${campaignId}`,
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
    throw new Error(`Failed to cancel campaign ${campaignId}`);
  }

  // Récupération des détails de la commande pour rembourser l'utilisateur
  const campaignResponse = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/campaigns/${campaignId}`,
    {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }
  );

  if (!campaignResponse.ok) {
    throw new Error(`Failed to fetch campaign ${campaignId} details`);
  }

  const campaignData = await campaignResponse.json();

  // Rembourser l'utilisateur
  const userUpdateResponse = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/users/${
      campaignData.userId
    }/updateBalance`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        amount: campaignData.price,
      }),
    }
  );

  if (!userUpdateResponse.ok) {
    throw new Error(`Failed to refund user ${campaignData.userId}`);
  }
}
