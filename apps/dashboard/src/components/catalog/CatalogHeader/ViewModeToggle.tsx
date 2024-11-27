import { LayoutGrid, Table2 } from 'lucide-react';
import Button from '../../Button';

interface ViewModeToggleProps {
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
}

export default function ViewModeToggle({
  viewMode,
  onViewModeChange
}: ViewModeToggleProps) {
  return (
    <div className="border-l pl-4 flex items-center space-x-2">
      <Button
        variant={viewMode === 'grid' ? 'primary' : 'outline'}
        onClick={() => onViewModeChange('grid')}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'table' ? 'primary' : 'outline'}
        onClick={() => onViewModeChange('table')}
      >
        <Table2 className="h-4 w-4" />
      </Button>
    </div>
  );
}