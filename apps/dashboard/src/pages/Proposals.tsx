import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, UserPlus, Heart, MessageCircle, Share2, ExternalLink, AlertCircle, Clock } from 'lucide-react';
import { useNotifications } from '../lib/notifications';
import { formatDate } from '../lib/utils';
import Button from '../components/Button';
import Input from '../components/Input';
import ReasonModal from '../components/ReasonModal';
import ProofModal from '../components/ProofModal';
import * as Tooltip from '@radix-ui/react-tooltip';
import { getTimeLeft } from '../components/TimeRemaining';
import { useProposals } from '../hooks/useProposals';

const ServiceIcon = ({ service }: { service: 'follow' | 'like' | 'comment' | 'repost_story' }) => {
  switch (service) {
    case 'follow':
      return <UserPlus className="h-4 w-4" />;
    case 'like':
      return <Heart className="h-4 w-4" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4" />;
    case 'repost_story':
      return <Share2 className="h-4 w-4" />;
  }
};

const StatusBadge = ({ status, reason, date, type }: { 
  status: string; 
  reason?: string;
  date?: Date;
  type?: 'delivery' | 'validation';
}) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    delivered: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    refused: 'bg-red-100 text-red-800',
    archived: 'bg-gray-100 text-gray-800'
  };

  const labels = {
    pending: 'Non traitée',
    accepted: 'À livrer',
    delivered: 'Livrée',
    completed: 'Terminée',
    refused: 'Refusée',
    archived: 'Archives'
  };

  return (
    <div className="flex items-center space-x-2">
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
      {(status === 'accepted' || status === 'delivered') && date && (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <Clock className="h-4 w-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                sideOffset={5}
              >
                {getTimeLeft(date, type || 'delivery')}
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
      {reason && (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="text-red-500 hover:text-red-600">
                <AlertCircle className="h-4 w-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                sideOffset={5}
              >
                {reason}
                <Tooltip.Arrow className="fill-gray-900" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  );
};

export default function Proposals() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'accepted' | 'delivered' | 'completed' | 'refused' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);

  const {
    proposals,
    loading,
    error,
    handleAcceptProposal,
    handleDeliverProposal,
    handleRefuseProposal,
    handleArchiveProposal
  } = useProposals();

  const filteredProposals = proposals.filter(proposal => {
    if (selectedTab !== 'all' && proposal.status !== selectedTab) return false;
    if (search && !proposal.influencer.username.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Propositions reçues</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les propositions de services reçues
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant={selectedTab === 'all' ? 'primary' : 'outline'}
              onClick={() => setSelectedTab('all')}
            >
              Toutes
            </Button>
            <Button
              variant={selectedTab === 'pending' ? 'primary' : 'outline'}
              onClick={() => setSelectedTab('pending')}
            >
              Non traitées
            </Button>
            <Button
              variant={selectedTab === 'accepted' ? 'primary' : 'outline'}
              onClick={() => setSelectedTab('accepted')}
            >
              À livrer
            </Button>
            <Button
              variant={selectedTab === 'delivered' ? 'primary' : 'outline'}
              onClick={() => setSelectedTab('delivered')}
            >
              Livrée
            </Button>
            <Button
              variant={selectedTab === 'completed' ? 'primary' : 'outline'}
              onClick={() => setSelectedTab('completed')}
            >
              Terminée
            </Button>
            <Button
              variant={selectedTab === 'refused' ? 'primary' : 'outline'}
              onClick={() => setSelectedTab('refused')}
            >
              Refusée
            </Button>
            <Button
              variant={selectedTab === 'archived' ? 'primary' : 'outline'}
              onClick={() => setSelectedTab('archived')}
            >
              Archives
            </Button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N°
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cible
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProposals.map((proposal) => (
                <tr key={proposal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{proposal.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(proposal.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={proposal.client.profileImage}
                        alt={proposal.client.username}
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="ml-2">{proposal.client.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ServiceIcon service={proposal.service} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {proposal.service === 'follow' ? (
                      proposal.target
                    ) : (
                      <a
                        href={proposal.target}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-purple-600 hover:text-purple-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Voir le post
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {proposal.price.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={proposal.status} 
                      reason={proposal.refusalReason}
                      date={proposal.acceptedAt || proposal.deliveredAt}
                      type={proposal.status === 'accepted' ? 'delivery' : 'validation'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {proposal.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptProposal(proposal.id)}
                          >
                            Accepter
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedProposalId(proposal.id);
                              setShowRefuseModal(true);
                            }}
                          >
                            Refuser
                          </Button>
                        </>
                      )}
                      {(proposal.status === 'accepted' || proposal.status === 'refused') && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedProposalId(proposal.id);
                            setShowProofModal(true);
                          }}
                        >
                          Livrer
                        </Button>
                      )}
                      {proposal.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleArchiveProposal(proposal.id)}
                        >
                          Archiver
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProofModal
        isOpen={showProofModal}
        onClose={() => {
          setShowProofModal(false);
          setSelectedProposalId(null);
        }}
        onSubmit={(file) => {
          if (selectedProposalId) {
            handleDeliverProposal(selectedProposalId, file);
          }
        }}
      />

      <ReasonModal
        isOpen={showRefuseModal}
        onClose={() => {
          setShowRefuseModal(false);
          setSelectedProposalId(null);
        }}
        onSubmit={(reason) => {
          if (selectedProposalId) {
            handleRefuseProposal(selectedProposalId, reason);
          }
        }}
        title="Refuser la proposition"
        description="Veuillez indiquer le motif de votre refus"
      />
    </DashboardLayout>
  );
}