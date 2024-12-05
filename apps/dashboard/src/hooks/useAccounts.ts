import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import { useNotifications } from "../lib/notifications";
import { SocialAccount } from "../lib/types";
import {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
  startVerification,
  confirmVerification,
  getAccount,
} from "../lib/firebase/accounts";

export function useAccounts() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const fetchedAccounts = await getAccounts(user.id);
        setAccounts(fetchedAccounts);
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

  const handleCreateAccount = async (
    accountData: Omit<SocialAccount, "id" | "createdAt">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const accountId = await createAccount(accountData, user.id);
      const newAccount = { id: accountId, ...accountData };
      setAccounts([...accounts, newAccount]);
      addNotification({
        type: "success",
        message: "Account created successfully",
      });
      return accountId;
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create account",
      });
      throw err;
    }
  };

  const handleUpdateAccount = async (
    accountId: string,
    updates: Partial<SocialAccount>
  ) => {
    try {
      await updateAccount(accountId, updates);
      setAccounts(
        accounts.map((acc) =>
          acc.id === accountId ? { ...acc, ...updates } : acc
        )
      );
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

  const handleDeleteAccount = async (accountId: string) => {
    try {
      await deleteAccount(accountId);
      setAccounts(accounts.filter((acc) => acc.id !== accountId));
      addNotification({
        type: "success",
        message: "Account deleted successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to delete account",
      });
      throw err;
    }
  };

  const handleStartVerification = async (accountId: string) => {
    try {
      const verificationCode =
        `VERIFY-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
      await startVerification(accountId, verificationCode);
      setAccounts(
        accounts.map((acc) =>
          acc.id === accountId ? { ...acc, verificationSent: true } : acc
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

  const handleConfirmVerification = async (accountId: string) => {
    try {
      await confirmVerification(accountId);
      setAccounts(
        accounts.map((acc) =>
          acc.id === accountId ? { ...acc, isVerified: true } : acc
        )
      );
      addNotification({
        type: "success",
        message: "Account verified successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to verify account",
      });
      throw err;
    }
  };

  return {
    accounts,
    loading,
    error,
    handleCreateAccount,
    handleUpdateAccount,
    handleDeleteAccount,
    handleStartVerification,
    handleConfirmVerification,
  };
}

export function useAccount(accountId: string) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [account, setAccount] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const fetchedAccount = await getAccount(accountId);
        setAccount(fetchedAccount);
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

  return {
    account,
    loading,
    error,
  };
}
