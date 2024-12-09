import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Platform, Service, SocialAccount } from '../../lib/types';
import { useNotifications } from '../../lib/notifications';
import { mockInfluencers } from '../../lib/mock-data';
import ServiceModal from '../../components/ServiceModal';
import MultiSelectServiceModal from '../../components/MultiSelectServiceModal';
import AIPilotModal from '../../components/AIPilotModal';
import CatalogHeader from '../../components/catalog/CatalogHeader';
import PlatformSelector from '../../components/catalog/PlatformSelector';
import InfluencerTable from '../../components/catalog/InfluencerTable';
import FiltersModal from '../../components/catalog/FiltersModal';
import { useInfluencerSort } from '../../hooks/useInfluencerSort';
import { useInfluencerFilters } from '../../hooks/useInfluencerFilters';
import { useMultiSelect } from './hooks/useMultiSelect';

export default function InfluencerCatalog() {
  const { addNotification } = useNotifications();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('instagram');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAIPilot, setShowAIPilot] = useState(false);
  const [showMultiSelect, setShowMultiSelect] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    service: Service;
    influencer: SocialAccount | null;
  } | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const {
    filters,
    setFilters,
    resetFilters,
    filteredInfluencers
  } = useInfluencerFilters(mockInfluencers, selectedPlatform, search);

  const {
    sortField,
    sortDirection,
    sortedInfluencers,
    handleSort
  } = useInfluencerSort(filteredInfluencers);

  const {
    multiSelectMode,
    selectedInfluencers,
    handleMultiSelectConfirm,
    handleConfirmSelection,
    resetMultiSelect,
    setSelectedInfluencers
  } = useMultiSelect();

  const handleServiceSelect = (influencer: SocialAccount, service: Service) => {
    if (multiSelectMode) {
      const isSelected = selectedInfluencers.includes(influencer.id);
      setSelectedInfluencers(
        isSelected 
          ? selectedInfluencers.filter(id => id !== influencer.id)
          : [...selectedInfluencers, influencer.id]
      );
    } else {
      setSelectedService({ service, influencer });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <CatalogHeader
          onShowAIPilot={() => setShowAIPilot(true)}
          onShowMultiSelect={() => setShowMultiSelect(true)}
          onShowFilters={() => setShowFilters(true)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          multiSelectMode={multiSelectMode}
          onCancelMultiSelect={resetMultiSelect}
          selectedCount={selectedInfluencers.length}
          onConfirmMultiSelect={() => handleConfirmSelection(sortedInfluencers)}
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
            onConfirm={(service, target, settings, commentText) => {
              addNotification({
                type: 'success',
                message: 'Sélection IA effectuée avec succès'
              });
              setShowAIPilot(false);
            }}
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