import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../lib/firebase/notifications';
import { NotificationType } from '../lib/types/notifications';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await getNotifications(user.id);
        setNotifications(fetchedNotifications);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const addNotification = async (notification: {
    type: NotificationType;
    message: string;
    data?: Record<string, any>;
    link?: string;
  }) => {
    if (!user) return;

    try {
      const notificationId = await createNotification({
        userId: user.id,
        title: notification.type.charAt(0).toUpperCase() + notification.type.slice(1),
        ...notification
      });

      const newNotification = {
        id: notificationId,
        ...notification,
        createdAt: new Date(),
        isRead: false
      };

      setNotifications([newNotification, ...notifications]);

      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    } catch (err) {
      console.error('Failed to create notification:', err);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;

    try {
      await markAllAsRead(user.id);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return {
    notifications,
    loading,
    addNotification,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification
  };
}