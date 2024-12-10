import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications";
import {
  createProposal,
  getProposals,
  updateProposal,
  deleteProposal,
  getProposal,
} from "../services/proposals";

export function useProposals() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProposals = async () => {
      try {
        setLoading(true);
        const fetchedProposals = await getProposals([], user.id);
        setProposals(fetchedProposals);
        setError(null);
      } catch (err) {
        setError("Error fetching proposals");
        addNotification({
          type: "error",
          message: "Failed to load proposals",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [user]);

  const handleCreateProposal = async (
    proposalData: Omit<any, "id" | "createdAt">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const proposalId = await createProposal(proposalData, user.id);
      const newProposal = { id: proposalId, ...proposalData };
      setProposals([...proposals, newProposal]);
      addNotification({
        type: "success",
        message: "Proposal created successfully",
      });
      return proposalId;
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create proposal",
      });
      throw err;
    }
  };

  const handleUpdateProposal = async (
    accountId: string,
    updates: Partial<any>
  ) => {
    try {
      await updateProposal(accountId, updates);
      const updatedProposals = proposals.map((proposal) =>
        proposal.id === accountId ? { ...proposal, ...updates } : proposal
      );
      setProposals(updatedProposals);
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

  const handleDeleteProposal = async (proposalId: string) => {
    try {
      await deleteProposal(proposalId);
      setProposals(proposals.filter((acc) => acc.id !== proposalId));
      addNotification({
        type: "success",
        message: "Proposal deleted successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to delete proposal",
      });
      throw err;
    }
  };

  return {
    proposals,
    loading,
    error,
    handleCreateProposal,
    handleUpdateProposal,
    handleDeleteProposal,
  };
}

export function useProposal(proposalId: string) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [proposal, setProposal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProposals = async () => {
      try {
        setLoading(true);
        const fetchedProposal = await getProposal(proposalId);
        setProposal(fetchedProposal);
        setError(null);
      } catch (err) {
        setError("Error fetching proposals");
        addNotification({
          type: "error",
          message: "Failed to load proposals",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [user]);

  const handleUpdateProposal = async (
    proposalId: string,
    updates: Partial<any>
  ) => {
    try {
      await updateProposal(proposalId, updates);
      setProposal((acc) => ({ ...acc, ...updates }));
      addNotification({
        type: "success",
        message: "Proposal updated successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to update proposal",
      });
      throw err;
    }
  };

  return {
    proposal,
    loading,
    error,
    handleUpdateProposal,
  };
}
