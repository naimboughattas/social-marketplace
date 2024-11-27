import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home,
  ShoppingBag,
  Wallet,
  CreditCard,
  Users,
  Instagram,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  MessageSquare,
  Shield,
  Gift,
  Globe,
  Bell,
  Zap,
  Palette,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { cn } from '../../lib/utils';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Collapsible from '@radix-ui/react-collapsible';

const navigation = [
  {
    name: 'Vue d\'ensemble',
    items: [
      { name: 'Tableau de bord', href: '/admin', icon: Home },
      { name: 'Analyses', href: '/admin/analytics', icon: BarChart2 },
      { name: 'Performances', href: '/admin/performance', icon: Zap },
    ]
  },
  {
    name: 'Gestion',
    items: [
      { name: 'Commandes', href: '/admin/orders', icon: ShoppingBag },
      { name: 'Recharges', href: '/admin/recharges', icon: Wallet },
      { name: 'Paiements', href: '/admin/payments', icon: CreditCard },
      { name: 'Clients', href: '/admin/customers', icon: Users },
      { name: 'Influenceurs', href: '/admin/influencers', icon: Instagram },
    ]
  },
  {
    name: 'Support',
    items: [
      { name: 'Support', href: '/admin/support', icon: MessageSquare },
      { name: 'Modération', href: '/admin/moderation', icon: Shield },
    ]
  },
  {
    name: 'Marketing',
    items: [
      { name: 'Récompenses', href: '/admin/rewards', icon: Gift },
      { name: 'SEO', href: '/admin/seo', icon: Globe },
      { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    ]
  },
  {
    name: 'Configuration',
    items: [
      { name: 'Paramètres', href: '/admin/settings', icon: Settings },
      { name: 'Thème', href: '/admin/theme', icon: Palette },
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [expandedSections, setExpandedSections] = useState<string[]>(['Vue d\'ensemble']);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newState));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <Menu className="h-6 w-6" />
              </button>
              <span className="ml-2 text-xl font-semibold">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 z-40 h-[calc(100vh-64px)] border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          {navigation.map((section) => (
            <Collapsible.Root
              key={section.name}
              open={expandedSections.includes(section.name)}
              onOpenChange={() => !isSidebarCollapsed && toggleSection(section.name)}
              className="mb-4"
            >
              {!isSidebarCollapsed && (
                <Collapsible.Trigger className="flex items-center justify-between w-full px-2 py-2 text-sm font-medium text-gray-500">
                  {section.name}
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    expandedSections.includes(section.name) ? "transform rotate-180" : ""
                  )} />
                </Collapsible.Trigger>
              )}
              <Collapsible.Content className={cn(
                "space-y-1",
                isSidebarCollapsed ? "block" : expandedSections.includes(section.name) ? "block" : "hidden"
              )}>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Tooltip.Provider key={item.name}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "flex items-center p-2 text-base font-normal rounded-lg",
                              location.pathname === item.href
                                ? "bg-purple-50 text-purple-600"
                                : "text-gray-900 hover:bg-gray-100",
                              isSidebarCollapsed && "justify-center"
                            )}
                          >
                            <Icon className={`h-5 w-5 ${!isSidebarCollapsed && 'mr-3'}`} />
                            {!isSidebarCollapsed && item.name}
                          </Link>
                        </Tooltip.Trigger>
                        {isSidebarCollapsed && (
                          <Tooltip.Portal>
                            <Tooltip.Content
                              side="right"
                              className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                              sideOffset={5}
                            >
                              {item.name}
                              <Tooltip.Arrow className="fill-gray-900" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        )}
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  );
                })}
              </Collapsible.Content>
            </Collapsible.Root>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        'p-4 sm:ml-64 pt-20',
        isSidebarCollapsed ? 'sm:ml-16' : 'sm:ml-64'
      )}>
        {children}
      </div>
    </div>
  );
}