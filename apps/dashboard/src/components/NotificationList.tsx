import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell, Check } from 'lucide-react';
import Button from './Button';
import { markAllNotificationsAsRead, markNotificationAsRead } from '../lib/mock-chat';

interface Notification {
  id: string;
  type: 'message' | 'status' | 'proposal';
  message: string;
  timestamp: Date;
  orderId?: string;
  proposalId?: string;
  isRead: boolean;
}

interface NotificationListProps {
  type: 'order' | 'proposal';
}

export default function NotificationList({ type }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = () => {
      const savedNotifications = localStorage.getItem('notifications');
      if (savedNotifications) {
        const allNotifications: Notification[] = JSON.parse(savedNotifications);
        // Filter notifications based on type
        const filteredNotifications = allNotifications.filter(notification => 
          type === 'order' ? notification.orderId : notification.proposalId
        );
        // Convert string dates back to Date objects
        const parsedNotifications = filteredNotifications.map(notification => ({
          ...notification,
          timestamp: new Date(notification.timestamp)
        }));
        setNotifications(parsedNotifications);
      } else {
        setNotifications([]);
      }
    };

    loadNotifications();
    // Refresh notifications every second
    const interval = setInterval(loadNotifications, 1000);
    return () => clearInterval(interval);
  }, [type]);

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications([]);
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  if (notifications.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucune notification
        </h3>
        <p className="text-gray-500">
          Vous n'avez pas de notification pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Notifications
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
        >
          Tout marquer comme lu
        </Button>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 ${notification.isRead ? 'bg-white' : 'bg-purple-50'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(notification.timestamp, { 
                    addSuffix: true,
                    locale: fr 
                  })}
                </p>
              </div>
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="ml-4 text-purple-600 hover:text-purple-700"
                  title="Marquer comme lu"
                >
                  <Check className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}