import { Link, useLocation } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { 
  ShoppingBag,
  CreditCard, 
  ClipboardList,
  FileText,
  InboxIcon,
  DollarSign,
  Users,
  Share2,
  RefreshCw,
  UserCheck,
  Trophy
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface NavigationProps {
  sections?: NavSection[];
  isSidebarCollapsed: boolean;
}

const defaultNavigation: NavSection[] = [
  {
    title: 'ACHETER',
    items: [
      { name: 'Catalogue', href: '/dashboard/buy', icon: ShoppingBag },
      { name: 'Recharger son compte', href: '/dashboard/topup', icon: CreditCard },
      { name: 'Commandes', href: '/dashboard/orders', icon: ClipboardList },
      { name: 'Abonnements', href: '/dashboard/subscriptions', icon: RefreshCw },
      { name: 'Factures', href: '/dashboard/invoices', icon: FileText },
      { name: 'Récompenses', href: '/dashboard/buyer-rewards', icon: Trophy }
    ]
  },
  {
    title: 'VENDRE',
    items: [
      { name: 'Propositions reçues', href: '/dashboard/proposals', icon: InboxIcon },
      { name: 'Mes abonnés', href: '/dashboard/subscribers', icon: UserCheck },
      { name: 'Retirer ses gains', href: '/dashboard/withdraw', icon: DollarSign },
      { name: 'Mes comptes', href: '/dashboard/my-accounts', icon: Users },
      { name: 'Affiliation', href: '/dashboard/affiliate', icon: Share2 },
      { name: 'Récompenses', href: '/dashboard/seller-rewards', icon: Trophy }
    ]
  }
];

export default function Navigation({ sections = defaultNavigation, isSidebarCollapsed }: NavigationProps) {
  const location = useLocation();

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-8">
      {sections.map((section, index) => (
        <div key={index}>
          {section.title && !isSidebarCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {section.title}
            </h3>
          )}
          <div className="mt-2 space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Tooltip.Provider key={item.name}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Link
                        to={item.href}
                        className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-3'} py-2 text-sm font-medium rounded-lg ${
                          location.pathname === item.href
                            ? 'bg-purple-50 text-purple-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
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
          </div>
        </div>
      ))}
    </div>
  );
}