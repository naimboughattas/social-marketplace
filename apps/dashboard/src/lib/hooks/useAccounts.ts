import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications";
import { SocialAccount } from "../types";
import {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
  getAccount,
} from "../services/accounts";

export function useAccounts(isOwner?: boolean) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !isOwner) return;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const fetchedAccounts = await getAccounts({
          ...(!isOwner && { filters: [["userId", "==", user.id]] }),
        });
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
      const updatedAccounts = accounts.map((account) =>
        account.id === accountId ? { ...account, ...updates } : account
      );
      setAccounts(updatedAccounts);
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

  return {
    accounts,
    loading,
    error,
    handleCreateAccount,
    handleUpdateAccount,
    handleDeleteAccount,
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

  const handleUpdateAccount = async (
    accountId: string,
    updates: Partial<SocialAccount>
  ) => {
    try {
      await updateAccount(accountId, updates);
      setAccount((acc) => ({ ...acc, ...updates }));
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

  return {
    account,
    loading,
    error,
    handleUpdateAccount,
  };
}
