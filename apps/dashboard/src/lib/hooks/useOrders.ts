import { useEffect, useState } from "react";
import { useNotifications } from "../notifications";
import { Order } from "../types/orders";
import {
  acceptOrder,
  completeOrder,
  disputeOrder,
  getOrders,
} from "../../lib/services/orders";
import { useAuth } from "../auth";

// Mock data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: 5,
    date: new Date(),
    platform: "instagram",
    influencer: {
      id: "1",
      username: "@fashion_style",
      profileImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop",
    },
    service: "follow",
    target: "@target_account2",
    price: 4.0,
    status: "delivered",
    acceptedAt: new Date(Date.now() - 3600000),
    deliveredAt: new Date(),
    confirmedAt: null,
    proofUrl: "https://example.com/proof.jpg",
  },
];

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
        const fetchedOrders = await getOrders({
          filters: [["userId", "==", user.id]],
        });
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
    handleDispute,
    handleAcceptDelivery,
    handleArchive,
  };
}
