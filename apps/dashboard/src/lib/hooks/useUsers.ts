import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications";
import { User } from "../types/user";
import { getUsers, updateUser } from "../services/users";

export function useUsers() {
  const { addNotification } = useNotifications();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getUsers([]);
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        setError("Error fetching users");
        addNotification({
          type: "error",
          message: "Failed to load users",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
  };
}

export function useUser(userId: string) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      await updateUser(userId, updates);
      addNotification({
        type: "success",
        message: "User updated successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to update user",
      });
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    handleUpdateUser,
  };
}
