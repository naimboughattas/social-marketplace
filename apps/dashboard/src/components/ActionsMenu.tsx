import { Menu } from '@headlessui/react';
import { MoreVertical } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '../lib/utils';

interface Action {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  notificationBadge?: boolean;
}

interface ActionsMenuProps {
  actions: Action[];
}

export default function ActionsMenu({ actions }: ActionsMenuProps) {
  const hasNotifications = actions.some(action => action.notificationBadge);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="relative">
        <Menu.Button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </Menu.Button>
        {hasNotifications && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>

      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="p-1">
          {actions.map((action, index) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <button
                  onClick={action.onClick}
                  className={cn(
                    'flex w-full items-center px-3 py-2 text-sm rounded-md relative',
                    action.variant === 'destructive'
                      ? 'text-red-600 hover:bg-red-50'
                      : active
                      ? 'bg-gray-50 text-gray-900'
                      : 'text-gray-700'
                  )}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                  {action.notificationBadge && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}