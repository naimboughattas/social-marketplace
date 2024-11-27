import { X, ShoppingCart } from 'lucide-react';
import Button from '../../Button';

interface MultiSelectActionsProps {
  selectedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function MultiSelectActions({
  selectedCount,
  onCancel,
  onConfirm
}: MultiSelectActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        onClick={onCancel}
      >
        <X className="h-4 w-4 mr-2" />
        Annuler
      </Button>
      <Button
        variant="primary"
        onClick={onConfirm}
        disabled={selectedCount === 0}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Ajouter au panier ({selectedCount})
      </Button>
    </div>
  );
}