import { useState, useRef, useEffect } from 'react';
import { format, subDays, startOfDay, endOfDay, isEqual } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { Button } from '@tremor/react';

const presets = [
  { label: "Aujourd'hui", getValue: () => [startOfDay(new Date()), endOfDay(new Date())] },
  { label: 'Hier', getValue: () => [startOfDay(subDays(new Date(), 1)), endOfDay(subDays(new Date(), 1))] },
  { label: '7 derniers jours', getValue: () => [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())] },
  { label: '30 derniers jours', getValue: () => [startOfDay(subDays(new Date(), 29)), endOfDay(new Date())] },
  { label: '90 derniers jours', getValue: () => [startOfDay(subDays(new Date(), 89)), endOfDay(new Date())] },
  { label: '365 derniers jours', getValue: () => [startOfDay(subDays(new Date(), 364)), endOfDay(new Date())] }
];

interface DateRangePickerProps {
  value: [Date, Date];
  onChange: (range: [Date, Date]) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPresetLabel = () => {
    const preset = presets.find(p => {
      const [start, end] = p.getValue();
      return isEqual(start, value[0]) && isEqual(end, value[1]);
    });

    if (preset) return preset.label;
    return `${format(value[0], 'dd/MM/yyyy')} - ${format(value[1], 'dd/MM/yyyy')}`;
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        icon={Calendar}
      >
        {getPresetLabel()}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="space-y-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => {
                    onChange(preset.getValue() as [Date, Date]);
                    setIsOpen(false);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}