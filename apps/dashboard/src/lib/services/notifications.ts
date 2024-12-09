import { NotificationType } from "../types/notifications";

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, any>;
  link?: string;
}

// Créer une nouvelle notification
export async function createNotification(
  data: Omit<Notification, "id" | "createdAt" | "isRead">
): Promise<string> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/notifications/create`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        ...data,
        isRead: false,
        createdAt: new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create notification");
  }

  const result = await response.json();
  return result.id;
}

// Récupérer toutes les notifications d'un utilisateur
export async function getNotifications(
  userId: string
): Promise<Notification[]> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/notifications`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ userId }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const result = await response.json();
  return result.notifications.map((doc: any) => ({
    id: doc.id,
    ...doc,
    createdAt: new Date(doc.createdAt),
  })) as Notification[];
}

// Marquer une notification comme lue
export async function markAsRead(notificationId: string): Promise<void> {
  const response = await fetch(
    `${
      import.meta.env.VITE_NEXT_PUBLIC_API_URL
    }/notifications/${notificationId}`,
    {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ isRead: true }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to mark notification ${notificationId} as read`);
  }
}

// Marquer toutes les notifications d'un utilisateur comme lues
export async function markAllAsRead(userId: string): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_NEXT_PUBLIC_API_URL}/notifications/markAllAsRead`,
    {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ userId }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to mark all notifications as read for user ${userId}`
    );
  }
}

// Supprimer une notification (soft delete)
export async function deleteNotification(
  notificationId: string
): Promise<void> {
  const response = await fetch(
    `${
      import.meta.env.VITE_NEXT_PUBLIC_API_URL
    }/notifications/${notificationId}`,
    {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete notification ${notificationId}`);
  }
}
