import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications";
import { Subscription } from "../types/subscriptions";
import {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
  getSubscription,
} from "../services/subscriptions";

export function useSubscriptions() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const fetchedSubscriptions = await getSubscriptions({
          filters: [["userId", "==", user.id]],
        });
        setSubscriptions(fetchedSubscriptions);
        setError(null);
      } catch (err) {
        setError("Error fetching subscriptions");
        addNotification({
          type: "error",
          message: "Failed to load subscriptions",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  const handleCreateSubscription = async (
    subscriptionData: Omit<Subscription, "id" | "createdAt">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const subscriptionId = await createSubscription(
        subscriptionData,
        user.id
      );
      const newSubscription = { id: subscriptionId, ...subscriptionData };
      setSubscriptions([...subscriptions, newSubscription]);
      addNotification({
        type: "success",
        message: "Subscription created successfully",
      });
      return subscriptionId;
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create subscription",
      });
      throw err;
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    try {
      await deleteSubscription(subscriptionId);
      setSubscriptions(
        subscriptions.filter((acc) => acc.id !== subscriptionId)
      );
      addNotification({
        type: "success",
        message: "Subscription deleted successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to delete subscription",
      });
      throw err;
    }
  };

  const handleStartVerification = async (subscriptionId: string) => {
    try {
      const verificationCode = `VERIFY-${Date.now().toString(
        36
      )}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
      setSubscriptions(
        subscriptions.map((acc) =>
          acc.id === subscriptionId ? { ...acc, verificationSent: true } : acc
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

  const handleConfirmVerification = async (subscriptionId: string) => {
    try {
      setSubscriptions(
        subscriptions.map((acc) =>
          acc.id === subscriptionId ? { ...acc, isVerified: true } : acc
        )
      );
      addNotification({
        type: "success",
        message: "Subscription verified successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to verify subscription",
      });
      throw err;
    }
  };

  return {
    subscriptions,
    loading,
    error,
    handleCreateSubscription,
    handleDeleteSubscription,
    handleStartVerification,
    handleConfirmVerification,
  };
}

export function useSubscription(subscriptionId: string) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [subscription, setSubscription] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const fetchedSubscription = await getSubscription(subscriptionId);
        setSubscription(fetchedSubscription);
        setError(null);
      } catch (err) {
        setError("Error fetching subscriptions");
        addNotification({
          type: "error",
          message: "Failed to load subscriptions",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user]);

  const handleUpdateSubscription = async (
    subscriptionId: string,
    updates: Partial<Subscription>
  ) => {
    try {
      await updateSubscription(subscriptionId, updates);
      setSubscription((acc) => ({ ...acc, ...updates }));
      addNotification({
        type: "success",
        message: "Subscription updated successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to update subscription",
      });
      throw err;
    }
  };

  return {
    subscription,
    loading,
    error,
    handleUpdateSubscription,
  };
}
