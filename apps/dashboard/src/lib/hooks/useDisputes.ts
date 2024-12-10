import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications";
import { Dispute } from "../types/disputes";
import {
  createDispute,
  getDisputes,
  updateDispute,
  deleteDispute,
  getDispute,
} from "../services/disputes";

export function useDisputes() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisputes = async (userId: string) => {
    try {
      setLoading(true);
      const fetchedDisputes = await getDisputes({
        filters: [["userId", "==", userId]],
      });
      setDisputes(fetchedDisputes);
      setError(null);
    } catch (err) {
      setError("Error fetching disputes");
      addNotification({
        type: "error",
        message: "Failed to load disputes",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchDisputes(user.id);
  }, [user]);

  const handleCreateDispute = async (
    disputeData: Omit<Dispute, "id" | "createdAt">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const disputeId = await createDispute(disputeData, user.id);
      const newDispute = { id: disputeId, ...disputeData };
      setDisputes([...disputes, newDispute]);
      addNotification({
        type: "success",
        message: "Dispute created successfully",
      });
      return disputeId;
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create dispute",
      });
      throw err;
    }
  };

  const handleUpdateDispute = async (
    disputeId: string,
    updates: Partial<Dispute>
  ) => {
    try {
      await updateDispute(disputeId, updates);
      await fetchDisputes(user.id);
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

  const handleDeleteDispute = async (disputeId: string) => {
    try {
      await deleteDispute(disputeId);
      setDisputes(disputes.filter((acc) => acc.id !== disputeId));
      addNotification({
        type: "success",
        message: "Dispute deleted successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to delete dispute",
      });
      throw err;
    }
  };

  return {
    disputes,
    loading,
    error,
    handleCreateDispute,
    handleUpdateDispute,
    handleDeleteDispute,
  };
}
