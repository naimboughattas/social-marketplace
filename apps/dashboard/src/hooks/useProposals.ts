import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useNotifications } from '../lib/notifications';
import {
  createProposal,
  getProposals,
  acceptProposal,
  deliverProposal,
  completeProposal,
  refuseProposal
} from '../lib/firebase/proposals';

export function useProposals() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProposals = async () => {
      try {
        setLoading(true);
        const fetchedProposals = await getProposals(user.id, user.role);
        setProposals(fetchedProposals);
        setError(null);
      } catch (err) {
        setError('Error fetching proposals');
        addNotification({
          type: 'error',
          message: 'Failed to load proposals'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [user]);

  const handleCreateProposal = async (data: any) => {
    try {
      const proposalId = await createProposal(data);
      const newProposal = { id: proposalId, ...data };
      setProposals([newProposal, ...proposals]);
      addNotification({
        type: 'success',
        message: 'Proposal created successfully'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to create proposal'
      });
      throw err;
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      await acceptProposal(proposalId);
      setProposals(proposals.map(p => 
        p.id === proposalId ? {
          ...p,
          status: 'accepted',
          acceptedAt: new Date()
        } : p
      ));
      addNotification({
        type: 'success',
        message: 'Proposal accepted'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to accept proposal'
      });
      throw err;
    }
  };

  const handleDeliverProposal = async (proposalId: string, file: File) => {
    try {
      await deliverProposal(proposalId);
      setProposals(proposals.map(p => 
        p.id === proposalId ? {
          ...p,
          status: 'delivered',
          deliveredAt: new Date()
        } : p
      ));
      addNotification({
        type: 'success',
        message: 'Proposal marked as delivered'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to deliver proposal'
      });
      throw err;
    }
  };

  const handleCompleteProposal = async (proposalId: string) => {
    try {
      await completeProposal(proposalId);
      setProposals(proposals.map(p => 
        p.id === proposalId ? {
          ...p,
          status: 'completed',
          completedAt: new Date()
        } : p
      ));
      addNotification({
        type: 'success',
        message: 'Proposal completed'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to complete proposal'
      });
      throw err;
    }
  };

  const handleRefuseProposal = async (proposalId: string, reason: string) => {
    try {
      await refuseProposal(proposalId, reason);
      setProposals(proposals.map(p => 
        p.id === proposalId ? {
          ...p,
          status: 'refused',
          refusalReason: reason
        } : p
      ));
      addNotification({
        type: 'success',
        message: 'Proposal refused'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to refuse proposal'
      });
      throw err;
    }
  };

  const handleArchiveProposal = async (proposalId: string) => {
    try {
      setProposals(proposals.map(p => 
        p.id === proposalId ? {
          ...p,
          status: 'archived'
        } : p
      ));
      addNotification({
        type: 'success',
        message: 'Proposal archived'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to archive proposal'
      });
      throw err;
    }
  };

  return {
    proposals,
    loading,
    error,
    handleCreateProposal,
    handleAcceptProposal,
    handleDeliverProposal,
    handleCompleteProposal,
    handleRefuseProposal,
    handleArchiveProposal
  };
}