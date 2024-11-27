import { SlidersHorizontal } from 'lucide-react';
import Button from '../Button';

interface FilterButtonProps {
  onClick: () => void;
  className?: string;
}

export default function FilterButton({ onClick, className }: FilterButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={className}
    >
      <SlidersHorizontal className="h-4 w-4 mr-2" />
      Filtres
    </Button>
  );
}