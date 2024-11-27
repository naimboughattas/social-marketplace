import { Pencil } from 'lucide-react';
import { Button } from '@tremor/react';
import { useState, useRef, useEffect } from 'react';

interface Metric {
  id: string;
  name: string;
}

interface MetricSelectorProps {
  metrics: Metric[];
  value: Metric;
  onChange: (metric: Metric) => void;
}

export function MetricSelector({ metrics, value, onChange }: MetricSelectorProps) {
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

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="light"
        icon={Pencil}
        onClick={() => setIsOpen(!isOpen)}
      >
        Modifier
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="space-y-2">
              {metrics.map((metric) => (
                <button
                  key={metric.id}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => {
                    onChange(metric);
                    setIsOpen(false);
                  }}
                >
                  {metric.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}