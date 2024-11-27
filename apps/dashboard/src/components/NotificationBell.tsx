// src/components/NotificationBell.tsx
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../lib/notifications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import * as Popover from '@radix-ui/react-popover';
import Button from './Button';
import { Link } from 'react-router-dom';

export default function NotificationBell() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    return <Bell className="h-4 w-4" />;
  };

  const getNotificationLink = (notification: any) => {
    switch (notification.type) {
      case 'order_status':
      case 'new_order':
        return `/dashboard/orders`;
      case 'new_proposal':
        return `/dashboard/proposals`;
      case 'support_reply':
        return `/dashboard/support`;
      default:
        return notification.link || '#';
    }
  };

  const formatNotificationDate = (date: Date | string) => {
    try {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(parsedDate.getTime())) {
        return 'Date invalide';
      }
      return formatDistanceToNow(parsedDate, { addSuffix: true, locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          sideOffset={5}
          align="end"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsRead()}
                >
                  Tout marquer comme lu
                </Button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucune notification
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    to={getNotificationLink(notification)}
                    className={`block p-4 hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-purple-50' : ''
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatNotificationDate(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
