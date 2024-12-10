import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications";
import { PaymentMethod } from "../types";
import {
  createPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
  getPaymentMethod,
} from "../services/paymentMethods";

export function usePaymentMethods() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = async (userId: string) => {
    try {
      setLoading(true);
      const fetchedPaymentMethods = await getPaymentMethods({
        filters: [["userId", "==", userId]],
      });
      setPaymentMethods(fetchedPaymentMethods);
      setError(null);
    } catch (err) {
      setError("Error fetching paymentMethods");
      addNotification({
        type: "error",
        message: "Failed to load paymentMethods",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchPaymentMethods(user.id);
  }, [user]);

  const handleCreatePaymentMethod = async (
    paymentMethodData: Omit<PaymentMethod, "id" | "createdAt">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const paymentMethodId = await createPaymentMethod(paymentMethodData, user.id);
      const newPaymentMethod = { id: paymentMethodId, ...paymentMethodData };
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      addNotification({
        type: "success",
        message: "PaymentMethod created successfully",
      });
      return paymentMethodId;
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create paymentMethod",
      });
      throw err;
    }
  };

  const handleUpdatePaymentMethod = async (
    paymentMethodId: string,
    updates: Partial<PaymentMethod>
  ) => {
    try {
      await updatePaymentMethod(paymentMethodId, updates);
      await fetchPaymentMethods(user.id);
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

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await deletePaymentMethod(paymentMethodId);
      setPaymentMethods(paymentMethods.filter((acc) => acc.id !== paymentMethodId));
      addNotification({
        type: "success",
        message: "PaymentMethod deleted successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to delete paymentMethod",
      });
      throw err;
    }
  };

  return {
    paymentMethods,
    loading,
    error,
    handleCreatePaymentMethod,
    handleUpdatePaymentMethod,
    handleDeletePaymentMethod,
  };
}
