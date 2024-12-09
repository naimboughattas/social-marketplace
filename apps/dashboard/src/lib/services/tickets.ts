import { Ticket } from "../types/tickets";

// Créer un nouveau compte
export async function createTicket(
  data: Omit<Ticket, "id" | "createdAt">,
  userId: string
): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/tickets/create`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ ...data, userId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create ticket");
  }

  const result = await response.json();
  return result.id;
}

// Récupérer tous les comptes d'un utilisateur avec des filtres
export async function getTickets(filters: any): Promise<Ticket[]> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/tickets`,
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
    throw new Error("Failed to fetch tickets");
  }

  return await response.json();
}

// Récupérer un compte spécifique par ID
export async function getTicket(ticketId: string): Promise<Ticket> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/tickets/${ticketId}`,
    {
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ticket with ID ${ticketId}`);
  }

  return await response.json();
}

// Mettre à jour un compte
export async function updateTicket(
  ticketId: string,
  updates: Partial<Ticket>
): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/tickets/${ticketId}`,
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
    throw new Error(`Failed to update ticket with ID ${ticketId}`);
  }
}

// Supprimer un compte (soft delete)
export async function deleteTicket(ticketId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/tickets/${ticketId}`,
    {
      method: "DELETE",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete ticket with ID ${ticketId}`);
  }
}
