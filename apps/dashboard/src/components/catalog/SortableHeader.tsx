import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortableHeaderProps {
  field: string;
  label: string;
  currentField: string;
  direction: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export default function SortableHeader({
  field,
  label,
  currentField,
  direction,
  onSort
}: SortableHeaderProps) {
  return (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {currentField === field ? (
          direction === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4" />
        )}
      </div>
    </th>
  );
}