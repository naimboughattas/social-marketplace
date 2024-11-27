import { LucideIcon } from 'lucide-react';
import Button from '../../Button';

interface ServiceCellProps {
  price?: number;
  icon: LucideIcon;
  onClick: () => void;
}

export default function ServiceCell({ price, icon: Icon, onClick }: ServiceCellProps) {
  if (!price) return <td className="px-6 py-4 whitespace-nowrap" />;
  
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <Button
        size="sm"
        variant="outline"
        onClick={onClick}
        className="flex items-center space-x-2"
      >
        <Icon className="h-4 w-4" />
        <span>{price.toFixed(2)} €</span>
      </Button>
    </td>
  );
}