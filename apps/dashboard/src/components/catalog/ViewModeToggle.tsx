import { LayoutGrid, Table2 } from 'lucide-react';
import Button from '../Button';

interface ViewModeToggleProps {
  mode: 'table' | 'grid';
  onChange: (mode: 'table' | 'grid') => void;
}

export default function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={mode === 'grid' ? 'primary' : 'outline'}
        onClick={() => onChange('grid')}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={mode === 'table' ? 'primary' : 'outline'}
        onClick={() => onChange('table')}
      >
        <Table2 className="h-4 w-4" />
      </Button>
    </div>
  );
}