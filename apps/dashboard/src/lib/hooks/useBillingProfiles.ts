import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications";
import { BillingProfile } from "../types/billingProfiles";
import {
  createBillingProfile,
  getBillingProfiles,
  updateBillingProfile,
  deleteBillingProfile,
  getBillingProfile,
} from "../services/billingProfiles";

export function useBillingProfiles() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [billingProfiles, setBillingProfiles] = useState<BillingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBillingProfiles = async (userId: string) => {
    try {
      setLoading(true);
      const fetchedBillingProfiles = await getBillingProfiles([
        ["userId", "==", userId],
      ]);
      setBillingProfiles(fetchedBillingProfiles);
      setError(null);
    } catch (err) {
      setError("Error fetching billingProfiles");
      addNotification({
        type: "error",
        message: "Failed to load billingProfiles",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchBillingProfiles(user.id);
  }, [user]);

  const handleCreateBillingProfile = async (
    billingprofileData: Omit<BillingProfile, "id" | "createdAt">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const billingprofileId = await createBillingProfile(
        billingprofileData,
        user.id
      );
      const newBillingProfile = { id: billingprofileId, ...billingprofileData };
      setBillingProfiles([...billingProfiles, newBillingProfile]);
      addNotification({
        type: "success",
        message: "BillingProfile created successfully",
      });
      return billingprofileId;
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create billingprofile",
      });
      throw err;
    }
  };

  const handleUpdateBillingProfile = async (
    billingProfileId: string,
    updates: Partial<BillingProfile>
  ) => {
    try {
      await updateBillingProfile(billingProfileId, updates);
      await fetchBillingProfiles(user.id);
      addNotification({
        type: "success",
        message: "BillingProfile updated successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to update billingprofile",
      });
      throw err;
    }
  };

  const handleDeleteBillingProfile = async (billingprofileId: string) => {
    try {
      await deleteBillingProfile(billingprofileId);
      setBillingProfiles(
        billingProfiles.filter((acc) => acc.id !== billingprofileId)
      );
      addNotification({
        type: "success",
        message: "BillingProfile deleted successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to delete billingprofile",
      });
      throw err;
    }
  };

  return {
    billingProfiles,
    loading,
    error,
    handleCreateBillingProfile,
    handleUpdateBillingProfile,
    handleDeleteBillingProfile,
  };
}

export function useBillingProfile(billingprofileId: string) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [billingprofile, setBillingProfile] = useState<BillingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchBillingProfiles = async () => {
      try {
        setLoading(true);
        const fetchedBillingProfile = await getBillingProfile(billingprofileId);
        setBillingProfile(fetchedBillingProfile);
        setError(null);
      } catch (err) {
        setError("Error fetching billingProfiles");
        addNotification({
          type: "error",
          message: "Failed to load billingProfiles",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBillingProfiles();
  }, [user]);

  const handleUpdateBillingProfile = async (
    billingprofileId: string,
    updates: Partial<BillingProfile>
  ) => {
    try {
      await updateBillingProfile(billingprofileId, updates);
      setBillingProfile((acc) => ({ ...acc, ...updates }));
      addNotification({
        type: "success",
        message: "BillingProfile updated successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to update billingprofile",
      });
      throw err;
    }
  };

  return {
    billingprofile,
    loading,
    error,
    handleUpdateBillingProfile,
  };
}
