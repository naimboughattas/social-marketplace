import { Sparkles, SlidersHorizontal, X, ShoppingCart, Megaphone } from 'lucide-react';
import Button from '../Button';

interface CatalogHeaderProps {
  onShowAIPilot: () => void;
  onShowCampaign: () => void;
  onShowMultiSelect: () => void;
  onShowFilters: () => void;
  multiSelectMode?: boolean;
  onCancelMultiSelect?: () => void;
  selectedCount?: number;
  onConfirmMultiSelect?: () => void;
}

export default function CatalogHeader({
  onShowAIPilot,
  onShowCampaign,
  onShowMultiSelect,
  onShowFilters,
  multiSelectMode = false,
  onCancelMultiSelect,
  selectedCount = 0,
  onConfirmMultiSelect
}: CatalogHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Catalogue</h2>
        <p className="mt-1 text-sm text-gray-500">
          {multiSelectMode 
            ? `${selectedCount} influenceur${selectedCount > 1 ? 's' : ''} sélectionné${selectedCount > 1 ? 's' : '' }`
            : 'Trouvez les meilleurs influenceurs pour votre marque'}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        {multiSelectMode ? (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onCancelMultiSelect}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={onConfirmMultiSelect}
              disabled={selectedCount === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ajouter au panier ({selectedCount})
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              variant="primary"
              onClick={onShowAIPilot}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              IA Pilot
            </Button>

            <Button
              variant="primary"
              onClick={onShowCampaign}
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-lg"
            >
              <Megaphone className="h-4 w-4 mr-2" />
              Campagne
            </Button>
            
            <Button
              variant="outline"
              onClick={onShowMultiSelect}
            >
              Sélection multiple
            </Button>

            <Button
              variant="outline"
              onClick={onShowFilters}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}