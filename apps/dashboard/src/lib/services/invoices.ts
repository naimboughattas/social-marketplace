import { Invoice } from "../types/invoices";

// Créer un nouveau compte
export async function createInvoice(
  data: Omit<Invoice, "id" | "createdAt">,
  userId: string
): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/invoices/create`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ ...data, userId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create invoice");
  }

  const result = await response.json();
  return result.id;
}

// Récupérer tous les comptes d'un utilisateur avec des filtres
export async function getInvoices(filters: any): Promise<Invoice[]> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/invoices`,
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
    throw new Error("Failed to fetch invoices");
  }

  return await response.json();
}

// Récupérer un compte spécifique par ID
export async function getInvoice(invoiceId: string): Promise<Invoice> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`,
    {
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch invoice with ID ${invoiceId}`);
  }

  return await response.json();
}

// Mettre à jour un compte
export async function updateInvoice(
  invoiceId: string,
  updates: Partial<Invoice>
): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`,
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
    throw new Error(`Failed to update invoice with ID ${invoiceId}`);
  }
}

// Supprimer un compte (soft delete)
export async function deleteInvoice(invoiceId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`,
    {
      method: "DELETE",
      headers: new Headers({
        "ngrok-skip-browser-warning": "69420",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete invoice with ID ${invoiceId}`);
  }
}
