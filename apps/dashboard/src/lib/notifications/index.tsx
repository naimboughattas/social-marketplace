import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, NotificationTrigger } from '../types/notifications';
import { NOTIFICATION_TITLES, NOTIFICATION_MESSAGES } from './constants';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (trigger: NotificationTrigger) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Persister les notifications dans le localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (trigger: NotificationTrigger) => {
    const notification: Notification = {
      id: crypto.randomUUID(),
      type: trigger.type,
      title: trigger.title || NOTIFICATION_TITLES[trigger.type],
      message: trigger.message || NOTIFICATION_MESSAGES[trigger.type](trigger.data),
      timestamp: new Date(),
      isRead: false,
      data: trigger.data,
      link: trigger.link
    };

    setNotifications(prev => [notification, ...prev]);

    // Jouer un son de notification
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {
      // Ignorer l'erreur si le navigateur bloque l'autoplay
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}