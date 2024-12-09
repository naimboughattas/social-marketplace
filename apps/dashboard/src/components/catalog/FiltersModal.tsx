import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { CATEGORIES, LANGUAGES, COUNTRIES } from '../../lib/types';
import Switch from '../Switch';
import CityInput from '../CityInput';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category: string;
    language: string;
    country: string;
    city: string;
    minFollowers: string;
    maxFollowers: string;
    minPrice: string;
    maxPrice: string;
    showOnlyFavorites: boolean;
    hideCollaborators: boolean;
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
}

export default function FiltersModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onReset
}: FiltersModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-lg font-medium">
              Filtres
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
                className="w-full rounded-md border border-gray-200 p-2"
              >
                <option value="">Toutes les catégories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Langue
              </label>
              <select
                value={filters.language}
                onChange={(e) => onFiltersChange({ ...filters, language: e.target.value })}
                className="w-full rounded-md border border-gray-200 p-2"
              >
                <option value="">Toutes les langues</option>
                {LANGUAGES.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <select
                value={filters.country}
                onChange={(e) => onFiltersChange({ ...filters, country: e.target.value })}
                className="w-full rounded-md border border-gray-200 p-2"
              >
                <option value="">Tous les pays</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <CityInput
                value={filters.city}
                onSelect={(city) => onFiltersChange({ ...filters, city })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Followers min
                </label>
                <Input
                  type="number"
                  value={filters.minFollowers}
                  onChange={(e) => onFiltersChange({ ...filters, minFollowers: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Followers max
                </label>
                <Input
                  type="number"
                  value={filters.maxFollowers}
                  onChange={(e) => onFiltersChange({ ...filters, maxFollowers: e.target.value })}
                  placeholder="∞"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix min (€)
                </label>
                <Input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix max (€)
                </label>
                <Input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
                  placeholder="∞"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Switch
                checked={filters.showOnlyFavorites}
                onChange={(checked) => onFiltersChange({ ...filters, showOnlyFavorites: checked })}
                label="Afficher uniquement les favoris"
              />

              <Switch
                checked={filters.hideCollaborators}
                onChange={(checked) => onFiltersChange({ ...filters, hideCollaborators: checked })}
                label="Ne pas afficher les collaborateurs précédents"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  onReset();
                  onClose();
                }}
              >
                Réinitialiser
              </Button>
              <Button onClick={onClose}>
                Appliquer
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}