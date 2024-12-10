import { useEffect, useState } from "react";
import { useNotifications } from "../notifications";
import { Campaign } from "../types/campaigns";
import {
  acceptCampaign,
  completeCampaign,
  disputeCampaign,
  getCampaigns,
  updateCampaign,
} from "../services/campaigns";
import { useAuth } from "../auth";

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
        const fetchedCampaigns = await getCampaigns([], user.id);
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

  const handleUpdateCampaign = async (
    accountId: string,
    updates: Partial<any>
  ) => {
    try {
      await updateCampaign(accountId, updates);
      const updatedCampaigns = campaigns.map((campaign) =>
        campaign.id === accountId ? { ...campaign, ...updates } : campaign
      );
      setCampaigns(updatedCampaigns);
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
    handleUpdateCampaign,
    handleDispute,
    handleAcceptDelivery,
    handleArchive,
  };
}
