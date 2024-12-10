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

export function useSubscriptions(type?: "influencer" | "customer") {
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
        const fetchedSubscriptions = await getSubscriptions([], type, user.id);
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

  const handleUpdateSubscription = async (
    subscriptionId: string,
    updates: any
  ) => {
    try {
      await updateSubscription(subscriptionId, updates);
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

  return {
    subscriptions,
    loading,
    error,
    handleCreateSubscription,
    handleUpdateSubscription,
    handleDeleteSubscription,
  };
}

export function useSubscription(subscriptionId: string) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
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
      setSubscription((acc) => acc && { ...acc, ...updates });
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
