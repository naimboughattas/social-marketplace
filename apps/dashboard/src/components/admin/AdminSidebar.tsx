import { Link, useLocation } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface NavSection {
  name: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  navigation: NavSection[];
}

export default function AdminSidebar({ isCollapsed, onToggle, navigation }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <aside className={cn(
      "fixed left-0 top-16 z-40 h-[calc(100vh-64px)] border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-4 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <Share2 className="h-8 w-8 text-purple-600" />
            {!isCollapsed && (
              <span className="text-xl font-bold">Admin</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {navigation.map((section) => (
            <div key={section.name}>
              {!isCollapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.name}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Tooltip.Provider key={item.name}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                              isActive
                                ? "bg-purple-50 text-purple-600"
                                : "text-gray-600 hover:bg-gray-50",
                              isCollapsed ? "justify-center" : "justify-start"
                            )}
                          >
                            <Icon className={cn(
                              "flex-shrink-0",
                              isCollapsed ? "h-6 w-6" : "h-5 w-5 mr-3"
                            )} />
                            {!isCollapsed && <span>{item.name}</span>}
                          </Link>
                        </Tooltip.Trigger>
                        {isCollapsed && (
                          <Tooltip.Portal>
                            <Tooltip.Content
                              side="right"
                              className="bg-gray-900 text-white px-2 py-1 rounded text-sm z-50"
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
      </div>
    </aside>
  );
}