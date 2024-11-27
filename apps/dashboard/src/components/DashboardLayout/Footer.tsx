import { LogOut } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface FooterProps {
  user: any;
  isSidebarCollapsed: boolean;
  onLogout: () => void;
}

export default function Footer({ user, isSidebarCollapsed, onLogout }: FooterProps) {
  return (
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
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={onLogout}
                className={`p-2 text-gray-400 hover:text-gray-600 ${isSidebarCollapsed && 'mx-auto'}`}
              >
                <LogOut className="h-5 w-5" />
              </button>
            </Tooltip.Trigger>
            {isSidebarCollapsed && (
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                  sideOffset={5}
                >
                  Déconnexion
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );
}