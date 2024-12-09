import { LucideIcon } from 'lucide-react';
import Button from '../../Button';
import { Service } from '../../../lib/types';

interface ServiceCellProps {
  price?: number;
  icon: LucideIcon;
  onClick: () => void;
  service: Service;
}

export default function ServiceCell({ price, icon: Icon, onClick, service }: ServiceCellProps) {
  if (!price) return <td className="px-6 py-4 whitespace-nowrap" />;
  
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <Button
        size="sm"
        variant="outline"
        onClick={onClick}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4" />
          <div className="flex items-baseline space-x-1">
            <span className="font-medium">{price.toFixed(2)}€</span>
            <span className="text-xs text-gray-500">
              {service === 'follow' ? '/ mois' : '/ post'}
            </span>
          </div>
        </div>
      </Button>
    </td>
  );
}