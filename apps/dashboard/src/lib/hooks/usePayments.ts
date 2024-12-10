import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications";
import { Payment } from "../types";
import {
  createPayment,
  getPayments,
  updatePayment,
  deletePayment,
  getPayment,
} from "../services/payments";

export function usePayments() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (userId: string) => {
    try {
      setLoading(true);
      const fetchedPayments = await getPayments({
        filters: [["userId", "==", userId]],
      });
      setPayments(fetchedPayments);
      setError(null);
    } catch (err) {
      setError("Error fetching payments");
      addNotification({
        type: "error",
        message: "Failed to load payments",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchPayments(user.id);
  }, [user]);

  const handleCreatePayment = async (
    paymentData: Omit<Payment, "id" | "createdAt">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const paymentId = await createPayment(paymentData, user.id);
      const newPayment = { id: paymentId, ...paymentData };
      setPayments([...payments, newPayment]);
      addNotification({
        type: "success",
        message: "Payment created successfully",
      });
      return paymentId;
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create payment",
      });
      throw err;
    }
  };

  const handleUpdatePayment = async (
    paymentId: string,
    updates: Partial<Payment>
  ) => {
    try {
      await updatePayment(paymentId, updates);
      await fetchPayments(user.id);
      addNotification({
        type: "success",
        message: "Account updated successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to update account",
      });
      throw err;
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    try {
      await deletePayment(paymentId);
      setPayments(payments.filter((acc) => acc.id !== paymentId));
      addNotification({
        type: "success",
        message: "Payment deleted successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to delete payment",
      });
      throw err;
    }
  };

  return {
    payments,
    loading,
    error,
    handleCreatePayment,
    handleUpdatePayment,
    handleDeletePayment,
  };
}
