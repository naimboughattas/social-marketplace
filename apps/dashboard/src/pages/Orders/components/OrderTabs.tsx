import Button from '../../../components/Button';
import { OrderStatus } from '../types';

interface OrderTabsProps {
  selectedTab: OrderStatus | 'all';
  onTabChange: (tab: OrderStatus | 'all') => void;
}

export default function OrderTabs({ selectedTab, onTabChange }: OrderTabsProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant={selectedTab === 'all' ? 'primary' : 'outline'}
        onClick={() => onTabChange('all')}
      >
        Toutes
      </Button>
      <Button
        variant={selectedTab === 'pending' ? 'primary' : 'outline'}
        onClick={() => onTabChange('pending')}
      >
        En attente
      </Button>
      <Button
        variant={selectedTab === 'in_progress' ? 'primary' : 'outline'}
        onClick={() => onTabChange('in_progress')}
      >
        En cours
      </Button>
      <Button
        variant={selectedTab === 'delivered' ? 'primary' : 'outline'}
        onClick={() => onTabChange('delivered')}
      >
        Livrée
      </Button>
      <Button
        variant={selectedTab === 'completed' ? 'primary' : 'outline'}
        onClick={() => onTabChange('completed')}
      >
        Terminée
      </Button>
      <Button
        variant={selectedTab === 'refused' ? 'primary' : 'outline'}
        onClick={() => onTabChange('refused')}
      >
        Refusée
      </Button>
      <Button
        variant={selectedTab === 'archived' ? 'primary' : 'outline'}
        onClick={() => onTabChange('archived')}
      >
        Archives
      </Button>
    </div>
  );
}