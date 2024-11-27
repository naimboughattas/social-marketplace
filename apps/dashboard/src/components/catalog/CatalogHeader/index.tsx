import ActionButtons from './ActionButtons';
import MultiSelectActions from './MultiSelectActions';
import ViewModeToggle from './ViewModeToggle';

interface CatalogHeaderProps {
  onShowAIPilot: () => void;
  onShowMultiSelect: () => void;
  onShowFilters: () => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  multiSelectMode?: boolean;
  onCancelMultiSelect?: () => void;
  selectedCount?: number;
  onConfirmMultiSelect?: () => void;
}

export default function CatalogHeader({
  onShowAIPilot,
  onShowMultiSelect,
  onShowFilters,
  viewMode,
  onViewModeChange,
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
            ? `${selectedCount} influenceur${selectedCount > 1 ? 's' : ''} sélectionné${selectedCount > 1 ? 's' : ''}`
            : 'Trouvez les meilleurs influenceurs pour votre marque'}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        {multiSelectMode ? (
          <MultiSelectActions
            selectedCount={selectedCount}
            onCancel={onCancelMultiSelect!}
            onConfirm={onConfirmMultiSelect!}
          />
        ) : (
          <ActionButtons
            onShowAIPilot={onShowAIPilot}
            onShowMultiSelect={onShowMultiSelect}
            onShowFilters={onShowFilters}
          />
        )}

        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
    </div>
  );
}