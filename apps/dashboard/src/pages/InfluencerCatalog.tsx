import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Platform, Service, SocialAccount } from "../lib/types";
import { useNotifications } from "../lib/notifications";
import { useCart } from "../lib/cart"; // Add this import
import { mockInfluencers } from "../lib/mock-data";
import ServiceModal from "../components/ServiceModal";
import MultiSelectServiceModal from "../components/MultiSelectServiceModal";
import AIPilotModal from "../components/ai-pilot/AIPilotModal";
import CampaignModal from "../components/campaign/CampaignModal";
import CatalogHeader from "../components/catalog/CatalogHeader";
import PlatformSelector from "../components/catalog/PlatformSelector";
import InfluencerTable from "../components/catalog/InfluencerTable";
import FiltersModal from "../components/catalog/FiltersModal";
import { useInfluencerSort } from "../hooks/useInfluencerSort";
import { useInfluencerFilters } from "../hooks/useInfluencerFilters";
import { getInfluencers } from "../lib/services/influencers";
import { useAccounts } from "../lib/hooks/useAccounts";

export default function InfluencerCatalog() {
  const { addNotification } = useNotifications();
  const { addItem } = useCart(); // Add this hook
  const [selectedPlatform, setSelectedPlatform] =
    useState<Platform>("instagram");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAIPilot, setShowAIPilot] = useState(false);
  const [showCampaign, setShowCampaign] = useState(false);
  const [showMultiSelect, setShowMultiSelect] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  // const [influencers, setInfluencers] = useState<SocialAccount[]>([]);
  const { accounts: influencers } = useAccounts(); // Replace the above line with this
  const [loading, setLoading] = useState(true);
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<{
    service: Service;
    influencer: SocialAccount | null;
  } | null>(null);
  const [currentMultiSelectService, setCurrentMultiSelectService] = useState<{
    service: Service;
    target: string;
    commentText?: string;
  } | null>(null);

  const { filters, setFilters, resetFilters, filteredInfluencers } =
    useInfluencerFilters(influencers, selectedPlatform, search);

  const { sortField, sortDirection, sortedInfluencers, handleSort } =
    useInfluencerSort(filteredInfluencers);

  const handleServiceSelect = (influencer: SocialAccount, service: Service) => {
    if (multiSelectMode) {
      const isSelected = selectedInfluencers.includes(influencer.id);
      setSelectedInfluencers(
        isSelected
          ? selectedInfluencers.filter((id) => id !== influencer.id)
          : [...selectedInfluencers, influencer.id]
      );
    } else {
      setSelectedService({ service, influencer });
    }
  };

  const handleMultiSelectConfirm = (
    service: Service,
    target: string,
    commentText?: string
  ) => {
    setShowMultiSelect(false);
    setMultiSelectMode(true);
    setSelectedInfluencers([]);
    setCurrentMultiSelectService({ service, target, commentText });
    addNotification({
      type: "info",
      message: "Sélectionnez maintenant les influenceurs pour cette action",
    });
  };

  const handleConfirmSelection = () => {
    if (!currentMultiSelectService) return;

    const selectedAccounts = sortedInfluencers.filter((inf) =>
      selectedInfluencers.includes(inf.id)
    );

    selectedAccounts.forEach((influencer) => {
      addItem({
        id: crypto.randomUUID(),
        influencerUsername: influencer.username,
        service: currentMultiSelectService.service,
        price: influencer.prices[currentMultiSelectService.service] || 0,
        targetHandle: currentMultiSelectService.target,
        commentText: currentMultiSelectService.commentText,
      });
    });

    addNotification({
      type: "success",
      message: `${selectedAccounts.length} service(s) ajouté(s) au panier`,
    });

    setMultiSelectMode(false);
    setSelectedInfluencers([]);
    setCurrentMultiSelectService(null);
  };

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoading(true);
        const fetchedInfluencers = await getInfluencers({
          platform: selectedPlatform,
        });
        setInfluencers(fetchedInfluencers);
      } catch (error) {
        addNotification({
          type: "error",
          message: "Erreur lors du chargement des influenceurs",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, [selectedPlatform]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CatalogHeader
          onShowAIPilot={() => setShowAIPilot(true)}
          onShowCampaign={() => setShowCampaign(true)}
          onShowMultiSelect={() => setShowMultiSelect(true)}
          onShowFilters={() => setShowFilters(true)}
          multiSelectMode={multiSelectMode}
          onCancelMultiSelect={() => {
            setMultiSelectMode(false);
            setSelectedInfluencers([]);
            setCurrentMultiSelectService(null);
          }}
          selectedCount={selectedInfluencers.length}
          onConfirmMultiSelect={handleConfirmSelection}
        />

        <PlatformSelector
          selectedPlatform={selectedPlatform}
          onPlatformSelect={setSelectedPlatform}
          search={search}
          onSearchChange={(e) => setSearch(e.target.value)}
        />

        <InfluencerTable
          influencers={sortedInfluencers}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onServiceSelect={handleServiceSelect}
          multiSelectMode={multiSelectMode}
          selectedInfluencers={selectedInfluencers}
        />

        {selectedService && (
          <ServiceModal
            isOpen={!!selectedService}
            onClose={() => setSelectedService(null)}
            service={selectedService.service}
            influencer={selectedService.influencer!}
          />
        )}

        {showAIPilot && (
          <AIPilotModal
            isOpen={showAIPilot}
            onClose={() => setShowAIPilot(false)}
            platform={selectedPlatform}
          />
        )}

        {showCampaign && (
          <CampaignModal
            isOpen={showCampaign}
            onClose={() => setShowCampaign(false)}
            platform={selectedPlatform}
          />
        )}

        {showMultiSelect && (
          <MultiSelectServiceModal
            isOpen={showMultiSelect}
            onClose={() => setShowMultiSelect(false)}
            onConfirm={handleMultiSelectConfirm}
          />
        )}

        <FiltersModal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />
      </div>
    </DashboardLayout>
  );
}
