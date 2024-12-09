import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { Service, Platform, PLATFORMS } from '../../lib/types';
import PlatformIcon from '../PlatformIcon';
import * as Dialog from '@radix-ui/react-dialog';

interface CampaignFilters {
  startDate: string;
  endDate: string;
  minPrice: string;
  maxPrice: string;
  services: Service[];
  platforms: Platform[];
}

interface CampaignFiltersProps {
  filters: CampaignFilters;
  onFiltersChange: (filters: CampaignFilters) => void;
  onReset: () => void;
}

const defaultFilters: CampaignFilters = {
  startDate: '',
  endDate: '',
  minPrice: '',
  maxPrice: '',
  services: [],
  platforms: []
};

export default function CampaignFilters({
  filters,
  onFiltersChange,
  onReset
}: CampaignFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleServiceToggle = (service: Service) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    onFiltersChange({ ...filters, services: newServices });
  };

  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    onFiltersChange({ ...filters, platforms: newPlatforms });
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher..."
          className="pl-10"
        />
      </div>

      <Button
        variant="outline"
        onClick={() => setShowFilters(true)}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtres avancés
      </Button>

      <Dialog.Root open={showFilters} onOpenChange={setShowFilters}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-lg font-medium">
                Filtres avancés
              </Dialog.Title>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Date range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      startDate: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      endDate: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* Price range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix minimum
                  </label>
                  <Input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      minPrice: e.target.value
                    })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix maximum
                  </label>
                  <Input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => onFiltersChange({
                      ...filters,
                      maxPrice: e.target.value
                    })}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['follow', 'like', 'comment', 'repost_story'] as Service[]).map((service) => (
                    <button
                      key={service}
                      onClick={() => handleServiceToggle(service)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        filters.services.includes(service)
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plateformes
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform}
                      onClick={() => handlePlatformToggle(platform)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                        filters.platforms.includes(platform)
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <PlatformIcon platform={platform} className="h-4 w-4" />
                      <span>{platform}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    onReset();
                    setShowFilters(false);
                  }}
                >
                  Réinitialiser
                </Button>
                <Button onClick={() => setShowFilters(false)}>
                  Appliquer
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}