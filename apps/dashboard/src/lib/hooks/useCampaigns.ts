import { useEffect, useState } from "react";
import { useNotifications } from "../notifications";
import { Campaign } from "../types/campaigns";
import {
  acceptCampaign,
  completeCampaign,
  disputeCampaign,
  getCampaigns,
} from "../services/campaigns";
import { useAuth } from "../auth";

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    orderNumber: 1,
    date: new Date(),
    platform: "instagram",
    service: "follow",
    target: "@target_account",
    settings: {
      category: "Fashion",
      country: "France",
      city: "Paris",
      language: "French",
      quantity: 50,
    },
    currentCount: 25,
    status: "in_progress",
    price: 4.0,
    totalCost: 100.0, // 25 * 4.00
  },
];

export function useCampaigns() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const fetchedCampaigns = await getCampaigns({
          filters: [["userId", "==", user.id]],
        });
        setCampaigns(fetchedCampaigns);
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

  const handleDispute = async (campaignId: string, reason: string) => {
    const response = await disputeCampaign(campaignId, reason);
    if (response.success) {
      setCampaigns(
        campaigns.map((o) =>
          o.id === campaignId
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

  const handleAcceptDelivery = async (campaignId: string) => {
    const response = await completeCampaign(campaignId);
    if (response.success) {
      setCampaigns(
        campaigns.map((o) =>
          o.id === campaignId
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
      message: "Failed to complete campaign",
    });
  };

  const handleArchive = (campaignId: string) => {
    setCampaigns(
      campaigns.map((o) =>
        o.id === campaignId
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
    campaigns,
    handleDispute,
    handleAcceptDelivery,
    handleArchive,
  };
}
