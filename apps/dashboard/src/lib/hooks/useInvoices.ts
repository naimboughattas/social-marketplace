import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications";
import { Invoice } from "../types/invoices";
import {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
  getInvoice,
} from "../services/invoices";

export function useInvoices() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const fetchedInvoices = await getInvoices([["userId", "==", user.id]]);
        setInvoices(fetchedInvoices);
        setError(null);
      } catch (err) {
        setError("Error fetching invoices");
        addNotification({
          type: "error",
          message: "Failed to load invoices",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const handleCreateInvoice = async (
    invoiceData: Omit<Invoice, "id" | "createdAt">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const invoiceId = await createInvoice(invoiceData, user.id);
      const newInvoice = { id: invoiceId, ...invoiceData };
      setInvoices([...invoices, newInvoice]);
      addNotification({
        type: "success",
        message: "Invoice created successfully",
      });
      return invoiceId;
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create invoice",
      });
      throw err;
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId);
      setInvoices(invoices.filter((acc) => acc.id !== invoiceId));
      addNotification({
        type: "success",
        message: "Invoice deleted successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to delete invoice",
      });
      throw err;
    }
  };

  const handleStartVerification = async (invoiceId: string) => {
    try {
      const verificationCode = `VERIFY-${Date.now().toString(
        36
      )}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
      setInvoices(
        invoices.map((acc) =>
          acc.id === invoiceId ? { ...acc, verificationSent: true } : acc
        )
      );
      addNotification({
        type: "success",
        message: "Verification process started",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to start verification",
      });
      throw err;
    }
  };

  const handleConfirmVerification = async (invoiceId: string) => {
    try {
      setInvoices(
        invoices.map((acc) =>
          acc.id === invoiceId ? { ...acc, isVerified: true } : acc
        )
      );
      addNotification({
        type: "success",
        message: "Invoice verified successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to verify invoice",
      });
      throw err;
    }
  };

  return {
    invoices,
    loading,
    error,
    handleCreateInvoice,
    handleDeleteInvoice,
    handleStartVerification,
    handleConfirmVerification,
  };
}

export function useInvoice(invoiceId: string) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [invoice, setInvoice] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const fetchedInvoice = await getInvoice(invoiceId);
        setInvoice(fetchedInvoice);
        setError(null);
      } catch (err) {
        setError("Error fetching invoices");
        addNotification({
          type: "error",
          message: "Failed to load invoices",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const handleUpdateInvoice = async (
    invoiceId: string,
    updates: Partial<Invoice>
  ) => {
    try {
      await updateInvoice(invoiceId, updates);
      setInvoice((acc) => ({ ...acc, ...updates }));
      addNotification({
        type: "success",
        message: "Invoice updated successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to update invoice",
      });
      throw err;
    }
  };

  return {
    invoice,
    loading,
    error,
    handleUpdateInvoice,
  };
}
