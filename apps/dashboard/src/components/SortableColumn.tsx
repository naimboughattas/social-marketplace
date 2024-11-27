import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortableColumnProps {
  label: string;
  sortField: string;
  currentSortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export default function SortableColumn({
  label,
  sortField,
  currentSortField,
  sortDirection,
  onSort
}: SortableColumnProps) {
  return (
    <button
      onClick={() => onSort(sortField)}
      className="flex items-center space-x-1 text-xs text-gray-500 uppercase"
    >
      <span>{label}</span>
      {currentSortField === sortField ? (
        sortDirection === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="h-4 w-4" />
      )}
    </button>
  );
}