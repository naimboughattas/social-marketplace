import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useCart } from '../../lib/cart';
import CartDrawer from '../CartDrawer';
import Button from '../Button';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { state } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        user={user}
        onLogout={handleLogout}
      />

      <div className={`transition-all duration-200 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-10" style={{ marginLeft: isSidebarCollapsed ? '4rem' : '16rem' }}>
          <div className="h-full px-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard/topup"
                className="group flex items-center text-sm text-gray-600 hover:text-purple-600"
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
                    className="group flex items-center text-sm text-gray-600 hover:text-purple-600"
                  >
                    <span>Gains:</span>
                    <span className="ml-1 font-medium">
                      {user?.pendingBalance?.toFixed(2)} €
                    </span>
                  </Link>
                </>
              )}

              <Link to="/dashboard/settings">
                <Button variant="outline" size="sm">
                  <SettingsIcon className="h-4 w-4" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
              >
                Panier ({state.items.length})
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="pt-16 p-6">
          {children}
        </main>
      </div>

      {/* Cart drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}