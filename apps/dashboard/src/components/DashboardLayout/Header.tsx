import { Menu, Settings as SettingsIcon, MessageSquare, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import { useAuth } from '../../lib/auth';
import NotificationBell from '../NotificationBell';

interface HeaderProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onCartOpen: () => void;
  cartItemsCount: number;
}

export default function Header({
  isSidebarCollapsed,
  onToggleSidebar,
  onCartOpen,
  cartItemsCount
}: HeaderProps) {
  const { user } = useAuth();

  return (
    <header 
      className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-10" 
      style={{ marginLeft: isSidebarCollapsed ? '4rem' : '16rem' }}
    >
      <div className="h-full px-4 flex items-center justify-between">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard/topup"
            className="text-sm text-gray-600 hover:text-purple-600"
          >
            <span>Solde:</span>
            <span className="ml-1 font-medium">
              {user?.balance?.toFixed(2)} €
            </span>
          </Link>

          {user?.pendingBalance !== undefined && (
            <>
              <span className="text-gray-300">|</span>
              <Link 
                to="/dashboard/withdraw"
                className="text-sm text-gray-600 hover:text-purple-600"
              >
                <span>Gains:</span>
                <span className="ml-1 font-medium">
                  {user?.pendingBalance?.toFixed(2)} €
                </span>
              </Link>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Link to="/dashboard/settings">
              <Button variant="outline" size="sm">
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </Link>

            <NotificationBell />

            <Link to="/dashboard/support">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4" />
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
        </div>
      </div>
    </header>
  );
}