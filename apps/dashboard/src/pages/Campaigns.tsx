import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, AlertCircle, Megaphone } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNotifications } from "../lib/notifications";
import * as Tooltip from "@radix-ui/react-tooltip";
import { formatDate } from "../lib/utils";
import CampaignModal from "../components/campaign/CampaignModal";
import CampaignFilters from "../components/campaign/CampaignFilters";
import PlatformIcon from "../components/PlatformIcon";
import ServiceIcon from "../components/ServiceIcon";
import { Platform, Service } from "../lib/types";
import { useCampaigns } from "../lib/hooks/useCampaigns";

type CampaignStatus =
  | "pending"
  | "in_progress"
  | "reached"
  | "completed"
  | "cancelled";

interface Campaign {
  id: string;
  campaignNumber: number;
  date: Date;
  platform: Platform;
  service: Service;
  target: string;
  settings: {
    category: string;
    country: string;
    city: string;
    language: string;
    quantity: number;
  };
  currentCount: number;
  status: CampaignStatus;
  price: number;
  totalCost: number;
}

interface CampaignFilters {
  startDate: string;
  endDate: string;
  minPrice: string;
  maxPrice: string;
  services: Service[];
  platforms: Platform[];
}

const defaultFilters: CampaignFilters = {
  startDate: "",
  endDate: "",
  minPrice: "",
  maxPrice: "",
  services: [],
  platforms: [],
};

const StatusBadge = ({ status }: { status: CampaignStatus }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    reached: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const labels = {
    pending: "En attente",
    in_progress: "En cours",
    reached: "Atteint",
    completed: "Terminée",
    cancelled: "Annulée",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

export default function Campaigns() {
  const { addNotification } = useNotifications();
  const [selectedTab, setSelectedTab] = useState<CampaignStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [filters, setFilters] = useState<CampaignFilters>(defaultFilters);

  const { campaigns, handleUpdateCampaign } = useCampaigns();

  const handleCancel = async (id: string) => {
    try {
      // API call to cancel campaign
      await handleUpdateCampaign(id, { status: "cancelled" });

      addNotification({
        type: "success",
        message: "Campagne annulée avec succès",
      });
    } catch (error) {
      addNotification({
        type: "error",
        message: "Erreur lors de l'annulation de la campagne",
      });
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (selectedTab !== "all" && campaign.status !== selectedTab) return false;
    if (search && !campaign.target.toLowerCase().includes(search.toLowerCase()))
      return false;

    // Date filters
    if (filters.startDate && new Date(filters.startDate) > campaign.date)
      return false;
    if (filters.endDate && new Date(filters.endDate) < campaign.date)
      return false;

    // Price filters
    if (filters.minPrice && campaign.price < parseFloat(filters.minPrice))
      return false;
    if (filters.maxPrice && campaign.price > parseFloat(filters.maxPrice))
      return false;

    // Service filter
    if (
      filters.services.length > 0 &&
      !filters.services.includes(campaign.service)
    )
      return false;

    // Platform filter
    if (
      filters.platforms.length > 0 &&
      !filters.platforms.includes(campaign.platform)
    )
      return false;

    return true;
  });

  console.log("filteredCampaigns", filteredCampaigns);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Campagnes</h2>
            <p className="mt-1 text-sm text-gray-500">
              Gérez vos campagnes d'influence
            </p>
          </div>
          <Button onClick={() => setShowNewCampaign(true)}>
            <Megaphone className="h-4 w-4 mr-2" />
            Nouvelle campagne
          </Button>
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
              En attente
            </Button>
            <Button
              variant={selectedTab === "in_progress" ? "primary" : "outline"}
              onClick={() => setSelectedTab("in_progress")}
            >
              En cours
            </Button>
            <Button
              variant={selectedTab === "reached" ? "primary" : "outline"}
              onClick={() => setSelectedTab("reached")}
            >
              Atteint
            </Button>
            <Button
              variant={selectedTab === "completed" ? "primary" : "outline"}
              onClick={() => setSelectedTab("completed")}
            >
              Terminée
            </Button>
            <Button
              variant={selectedTab === "cancelled" ? "primary" : "outline"}
              onClick={() => setSelectedTab("cancelled")}
            >
              Annulée
            </Button>
          </div>

          <CampaignFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
          />
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
                  Service
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Plateforme
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
                  Progression
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Coût total
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
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{campaign.campaignNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(campaign.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ServiceIcon service={campaign.service} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PlatformIcon platform={campaign.platform} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.target}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{
                            width: `${
                              (campaign.currentCount /
                                campaign.settings.quantity) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <Link
                        to={`/dashboard/campaigns/${campaign.id}/campaigns`}
                        className="ml-2 text-sm text-gray-600 hover:text-purple-600"
                      >
                        {campaign.currentCount}/{campaign.settings.quantity}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.totalCost.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {campaign.status === "in_progress" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleCancel(campaign.id)}
                      >
                        Annuler
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucune campagne trouvée
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par créer une nouvelle campagne
              </p>
              <div className="mt-6">
                <Button onClick={() => setShowNewCampaign(true)}>
                  Créer une campagne
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNewCampaign && (
        <CampaignModal
          isOpen={showNewCampaign}
          onClose={() => setShowNewCampaign(false)}
          platform="instagram"
        />
      )}
    </DashboardLayout>
  );
}
