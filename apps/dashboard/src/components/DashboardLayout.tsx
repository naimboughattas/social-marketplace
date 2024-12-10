import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Settings as SettingsIcon, MessageSquare, Share2, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart';
import CartDrawer from './CartDrawer';
import Button from './Button';
import NotificationBell from './NotificationBell';
import Navigation from './DashboardLayout/Navigation';
import LanguageSelector from './LanguageSelector';

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

  // Force re-render when user data changes
  const [, setForceUpdate] = useState({});
  useEffect(() => {
    const interval = setInterval(() => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setForceUpdate({});
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 ${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-200`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center px-4 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              {!isSidebarCollapsed && (
                <span className="text-xl font-bold">SocialBoost</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <Navigation isSidebarCollapsed={isSidebarCollapsed} />

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              {!isSidebarCollapsed && (
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-500">
                      {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className={`p-2 text-gray-400 hover:text-gray-600 ${isSidebarCollapsed && 'mx-auto'}`}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
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

              <NotificationBell />

              <div className="flex items-center space-x-2">
                <LanguageSelector />
                
                <Link to="/settings">
                  <Button variant="outline" size="sm">
                    <SettingsIcon className="h-4 w-4" />
                  </Button>
                </Link>

                <Link to="/dashboard/support">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
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
          </div>
        </header>

        {/* Page content */}
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