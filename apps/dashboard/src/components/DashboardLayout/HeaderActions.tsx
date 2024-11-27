import { Link } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import Button from '../Button';
import { useAuth } from '../../lib/auth';

interface HeaderActionsProps {
  onCartOpen: () => void;
  cartItemsCount: number;
}

export default function HeaderActions({ onCartOpen, cartItemsCount }: HeaderActionsProps) {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600 flex items-center">
          <span>Solde: </span>
          <Link 
            to="/dashboard/topup"
            className="ml-1 font-medium hover:text-purple-600 transition-colors"
          >
            {(user?.balance || 0).toFixed(2)} €
          </Link>
        </div>

        {user?.pendingBalance !== undefined && (
          <>
            <span className="text-gray-300">|</span>
            <div className="text-sm text-gray-600 flex items-center">
              <span>Gains: </span>
              <Link 
                to="/dashboard/withdraw"
                className="ml-1 font-medium hover:text-purple-600 transition-colors"
              >
                {(user?.pendingBalance || 0).toFixed(2)} €
              </Link>
            </div>
          </>
        )}
      </div>

      <Link to="/dashboard/settings">
        <Button variant="outline" size="sm">
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </Link>

      <Button
        variant="outline"
        size="sm"
        onClick={onCartOpen}
      >
        Panier ({cartItemsCount})
      </Button>
    </div>
  );
}