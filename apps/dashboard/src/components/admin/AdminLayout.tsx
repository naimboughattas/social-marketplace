import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu,
  Home,
  BarChart2,
  Zap,
  ShoppingBag,
  Wallet,
  CreditCard,
  Users,
  Instagram,
  MessageSquare,
  Shield,
  Gift,
  Globe,
  Bell,
  Settings,
  Palette,
  LogOut,
  Share2
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { cn } from '../../lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: 'VUE D\'ENSEMBLE',
    items: [
      { name: 'Tableau de bord', href: '/admin', icon: Home },

    ]
  },
  {
    name: 'GESTION',
    items: [
      { name: 'Commandes', href: '/admin/orders', icon: ShoppingBag },
      { name: 'Recharges', href: '/admin/recharges', icon: Wallet },
      { name: 'Paiements', href: '/admin/payments', icon: CreditCard },
      { name: 'Clients', href: '/admin/customers', icon: Users },
      { name: 'Influenceurs', href: '/admin/influencers', icon: Instagram },
    ]
  },
  {
    name: 'SUPPORT',
    items: [
      { name: 'Support', href: '/admin/support', icon: MessageSquare },
      { name: 'Modération', href: '/admin/moderation', icon: Shield },
    ]
  },
  {
    name: 'MARKETING',
    items: [
      { name: 'Récompenses', href: '/admin/rewards', icon: Gift },
      { name: 'SEO', href: '/admin/seo', icon: Globe },
      { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    ]
  },
  {
    name: 'CONFIGURATION',
    items: [
      { name: 'Paramètres', href: '/admin/settings', icon: Settings },
      { name: 'Thème', href: '/admin/theme', icon: Palette },
    ]
  }
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 transition-all duration-200",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center px-4 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <Share2 className="h-8 w-8 text-purple-600" />
              {!isSidebarCollapsed && (
                <span className="text-xl font-bold">Admin</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-8">
            {navigation.map((section) => (
              <div key={section.name}>
                {!isSidebarCollapsed && (
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {section.name}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-3'} py-2 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50`}
                      >
                        <Icon className={`h-5 w-5 ${!isSidebarCollapsed && 'mr-3'}`} />
                        {!isSidebarCollapsed && item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-colors",
                isSidebarCollapsed ? "justify-center" : "px-3"
              )}
            >
              <LogOut className={`h-5 w-5 ${!isSidebarCollapsed && 'mr-3'}`} />
              {!isSidebarCollapsed && "Déconnexion"}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-200 pt-16 p-6",
        isSidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        {children}
      </div>
    </div>
  );
}