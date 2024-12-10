import { useEffect, useState } from "react";
import { useNotifications } from "../notifications";
import { Order } from "../types/orders";
import {
  acceptOrder,
  completeOrder,
  createOrder,
  disputeOrder,
  getOrders,
} from "../../lib/services/orders";
import { useAuth } from "../auth";

export function useOrders() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await getOrders([], user.id);
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        setError("Error fetching accounts");
        addNotification({
          type: "error",
          message: "Failed to load accounts",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [user]);

  const handleCreateOrder = async (
    orderData: Omit<Order, "id" | "createdAt">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const orderId = await createOrder(orderData, user.id);
      const newOrder = { id: orderId, ...orderData };
      setOrders([...orders, newOrder]);
      addNotification({
        type: "success",
        message: "BillingProfile created successfully",
      });
      return orderId;
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create billingprofile",
      });
      throw err;
    }
  };

  const handleDispute = async (orderId: string, reason: string) => {
    const response = await disputeOrder(orderId, reason);
    if (response.success) {
      setOrders(
        orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "refused",
                disputeReason: reason,
              }
            : o
        )
      );

      addNotification({
        type: "success",
        message: "Livraison contestée",
      });
    }

    addNotification({
      type: "error",
      message: "Failed to dispute delivery",
    });
  };

  const handleAcceptDelivery = async (orderId: string) => {
    const response = await completeOrder(orderId);
    if (response.success) {
      setOrders(
        orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "completed",
              }
            : o
        )
      );

      addNotification({
        type: "success",
        message: "Commande livrée",
      });
    }

    addNotification({
      type: "error",
      message: "Failed to complete order",
    });
  };

  const handleArchive = (orderId: string) => {
    setOrders(
      orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "archived",
            }
          : o
      )
    );

    addNotification({
      type: "success",
      message: "Commande archivée",
    });
  };

  return {
    orders,
    handleCreateOrder,
    handleDispute,
    handleAcceptDelivery,
    handleArchive,
  };
}
