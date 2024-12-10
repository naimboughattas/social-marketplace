import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, AlertCircle, Megaphone, Sparkles } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNotifications } from "../lib/notifications";
import * as Tooltip from "@radix-ui/react-tooltip";
import { formatDate } from "../lib/utils";
import ProofModal from "../components/ProofModal";
import ReasonModal from "../components/ReasonModal";
import PlatformIcon from "../components/PlatformIcon";
import ServiceIcon from "../components/ServiceIcon";
import { Platform, Service } from "../lib/types";
import { useProposals } from "../lib/hooks/useProposals";

type ProposalStatus =
  | "pending"
  | "accepted"
  | "delivered"
  | "completed"
  | "refused"
  | "archived";
type ProposalSource = "catalog" | "ai_pilot" | "campaign";

const SourceIcon = ({ source }: { source: ProposalSource }) => {
  switch (source) {
    case "catalog":
      return null; // Pas d'icône pour le catalogue
    case "ai_pilot":
      return <Sparkles className="h-3 w-3 text-purple-600" />;
    case "campaign":
      return <Megaphone className="h-3 w-3 text-pink-600" />;
  }
};

const SourceLabel = ({ source }: { source: ProposalSource }) => {
  switch (source) {
    case "catalog":
      return "Catalogue";
    case "ai_pilot":
      return "IA Pilot";
    case "campaign":
      return "Campagne";
  }
};

const StatusBadge = ({
  status,
  reason,
}: {
  status: string;
  reason?: string;
}) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    delivered: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    refused: "bg-red-100 text-red-800",
    archived: "bg-gray-100 text-gray-800",
  };

  const labels = {
    pending: "Non traitée",
    accepted: "À livrer",
    delivered: "Livrée",
    completed: "Terminée",
    refused: "Refusée",
    archived: "Archivée",
  };

  return (
    <div className="flex items-center space-x-2">
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
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
  const { addNotification } = useNotifications();
  const [selectedTab, setSelectedTab] = useState<ProposalStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showProofModal, setShowProofModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
    null
  );
  const { proposals } = useProposals();

  const handleAccept = (id: string) => {
    setProposals(
      proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "accepted" as ProposalStatus,
              acceptedAt: new Date(),
            }
          : p
      )
    );

    addNotification({
      type: "success",
      message: "Proposition acceptée",
    });
  };

  const handleRefuse = (id: string, reason: string) => {
    setProposals(
      proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "refused" as ProposalStatus,
              refusalReason: reason,
            }
          : p
      )
    );

    addNotification({
      type: "success",
      message: "Proposition refusée",
    });
  };

  const handleDeliver = (id: string, file: File) => {
    setProposals(
      proposals.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "delivered" as ProposalStatus,
              deliveredAt: new Date(),
              proofUrl: URL.createObjectURL(file),
            }
          : p
      )
    );

    addNotification({
      type: "success",
      message: "Preuve de livraison envoyée",
    });
  };

  const filteredProposals = proposals.filter((proposal) => {
    if (selectedTab !== "all" && proposal.status !== selectedTab) return false;
    if (
      search &&
      !proposal.client.username.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Propositions reçues
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les propositions de services reçues
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              variant={selectedTab === "all" ? "primary" : "outline"}
              onClick={() => setSelectedTab("all")}
            >
              Toutes
            </Button>
            <Button
              variant={selectedTab === "pending" ? "primary" : "outline"}
              onClick={() => setSelectedTab("pending")}
            >
              Non traitées
            </Button>
            <Button
              variant={selectedTab === "accepted" ? "primary" : "outline"}
              onClick={() => setSelectedTab("accepted")}
            >
              À livrer
            </Button>
            <Button
              variant={selectedTab === "delivered" ? "primary" : "outline"}
              onClick={() => setSelectedTab("delivered")}
            >
              Livrée
            </Button>
            <Button
              variant={selectedTab === "completed" ? "primary" : "outline"}
              onClick={() => setSelectedTab("completed")}
            >
              Terminée
            </Button>
            <Button
              variant={selectedTab === "refused" ? "primary" : "outline"}
              onClick={() => setSelectedTab("refused")}
            >
              Refusée
            </Button>
            <Button
              variant={selectedTab === "archived" ? "primary" : "outline"}
              onClick={() => setSelectedTab("archived")}
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
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  N°
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Source
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Compte
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cible
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Prix
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
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
                    <div className="flex items-center space-x-1">
                      <SourceIcon source={proposal.source} />
                      <span className="text-sm text-gray-900">
                        {SourceLabel({ source: proposal.source })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div className="flex items-center">
                            <img
                              src={proposal.client.profileImage}
                              alt={proposal.client.username}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                            sideOffset={5}
                          >
                            {proposal.client.username}
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ServiceIcon service={proposal.service} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {proposal.service === "follow" ? (
                      proposal.target
                    ) : (
                      <Link
                        to={proposal.target}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-purple-600 hover:text-purple-700"
                      >
                        Voir le post
                      </Link>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {proposal.price.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge
                      status={proposal.status}
                      reason={proposal.refusalReason}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {proposal.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(proposal.id)}
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
                      {proposal.status === "accepted" && (
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
            handleDeliver(selectedProposalId, file);
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
            handleRefuse(selectedProposalId, reason);
          }
        }}
        title="Refuser la proposition"
        description="Veuillez indiquer le motif de votre refus"
      />
    </DashboardLayout>
  );
}
