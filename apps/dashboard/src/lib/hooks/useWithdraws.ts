import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications";
import { Withdraw } from "../types/withdraws";
import {
  createWithdraw,
  getWithdraws,
  updateWithdraw,
  deleteWithdraw,
  getWithdraw,
} from "../services/withdraws";

export function useWithdraws() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [withdraws, setWithdraws] = useState<Withdraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithdraws = async (userId: string) => {
    try {
      setLoading(true);
      const fetchedWithdraws = await getWithdraws([
        ["userId", "==", userId],
      ]);
      setWithdraws(fetchedWithdraws);
      setError(null);
    } catch (err) {
      setError("Error fetching withdraws");
      addNotification({
        type: "error",
        message: "Failed to load withdraws",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchWithdraws(user.id);
  }, [user]);

  const handleCreateWithdraw = async (
    withdrawData: Omit<Withdraw, "id" | "createdAt">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const withdrawId = await createWithdraw(
        withdrawData,
        user.id
      );
      const newWithdraw = { id: withdrawId, ...withdrawData };
      setWithdraws([...withdraws, newWithdraw]);
      addNotification({
        type: "success",
        message: "Withdraw created successfully",
      });
      return withdrawId;
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create withdraw",
      });
      throw err;
    }
  };

  const handleUpdateWithdraw = async (
    withdrawId: string,
    updates: Partial<Withdraw>
  ) => {
    try {
      await updateWithdraw(withdrawId, updates);
      await fetchWithdraws(user.id);
      addNotification({
        type: "success",
        message: "Withdraw updated successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to update withdraw",
      });
      throw err;
    }
  };

  const handleDeleteWithdraw = async (withdrawId: string) => {
    try {
      await deleteWithdraw(withdrawId);
      setWithdraws(
        withdraws.filter((acc) => acc.id !== withdrawId)
      );
      addNotification({
        type: "success",
        message: "Withdraw deleted successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to delete withdraw",
      });
      throw err;
    }
  };

  return {
    withdraws,
    loading,
    error,
    handleCreateWithdraw,
    handleUpdateWithdraw,
    handleDeleteWithdraw,
  };
}

export function useWithdraw(withdrawId: string) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [withdraw, setWithdraw] = useState<Withdraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchWithdraws = async () => {
      try {
        setLoading(true);
        const fetchedWithdraw = await getWithdraw(withdrawId);
        setWithdraw(fetchedWithdraw);
        setError(null);
      } catch (err) {
        setError("Error fetching withdraws");
        addNotification({
          type: "error",
          message: "Failed to load withdraws",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWithdraws();
  }, [user]);

  const handleUpdateWithdraw = async (
    withdrawId: string,
    updates: Partial<Withdraw>
  ) => {
    try {
      await updateWithdraw(withdrawId, updates);
      setWithdraw((acc) => ({ ...acc, ...updates }));
      addNotification({
        type: "success",
        message: "Withdraw updated successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to update withdraw",
      });
      throw err;
    }
  };

  return {
    withdraw,
    loading,
    error,
    handleUpdateWithdraw,
  };
}
