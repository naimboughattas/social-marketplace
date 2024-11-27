import { Sparkles, SlidersHorizontal } from 'lucide-react';
import Button from '../../Button';

interface ActionButtonsProps {
  onShowAIPilot: () => void;
  onShowMultiSelect: () => void;
  onShowFilters: () => void;
}

export default function ActionButtons({
  onShowAIPilot,
  onShowMultiSelect,
  onShowFilters
}: ActionButtonsProps) {
  return (
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
  );
}