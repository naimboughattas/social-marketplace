import { Search, Filter, X } from 'lucide-react';
import { Card, TextInput, Select, SelectItem } from '@tremor/react';
import Button from '../Button';

interface Filter {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: string; label: string; }[];
}

interface AdminFiltersProps {
  filters: Filter[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset: () => void;
}

export default function AdminFilters({
  filters,
  values,
  onChange,
  onReset
}: AdminFiltersProps) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <TextInput
          icon={Search}
          placeholder="Rechercher..."
          value={values.search || ''}
          onChange={(e) => onChange({ ...values, search: e.target.value })}
        />
        {filters.map((filter) => (
          <div key={filter.id} className="flex-1">
            {filter.type === 'select' ? (
              <Select
                value={values[filter.id] || ''}
                onValueChange={(value) => onChange({ ...values, [filter.id]: value })}
              >
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            ) : filter.type === 'date' ? (
              <input
                type="date"
                value={values[filter.id] || ''}
                onChange={(e) => onChange({ ...values, [filter.id]: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            ) : (
              <TextInput
                type={filter.type}
                placeholder={filter.label}
                value={values[filter.id] || ''}
                onChange={(e) => onChange({ ...values, [filter.id]: e.target.value })}
              />
            )}
          </div>
        ))}
        <Button
          variant="outline"
          onClick={onReset}
        >
          <X className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
    </Card>
  );
}