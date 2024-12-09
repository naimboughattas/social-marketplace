import { useState, useEffect } from "react";
import { useAuth } from "../auth";
import { useNotifications } from "../notifications";
import { Ticket } from "../types";
import {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
  getTicket,
} from "../services/tickets";

export function useTickets() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      try {
        setLoading(true);
        const fetchedTickets = await getTickets({
          filters: [["userId", "==", user.id]],
        });
        setTickets(fetchedTickets);
        setError(null);
      } catch (err) {
        setError("Error fetching tickets");
        addNotification({
          type: "error",
          message: "Failed to load tickets",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const handleCreateTicket = async (
    ticketData: Omit<Ticket, "id" | "createdAt">
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const ticketId = await createTicket(ticketData, user.id);
      const newTicket = { id: ticketId, ...ticketData };
      setTickets([...tickets, newTicket]);
      addNotification({
        type: "success",
        message: "Ticket created successfully",
      });
      return ticketId;
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to create ticket",
      });
      throw err;
    }
  };

  const handleUpdateTicket = async (
    userId: string,
    updates: Partial<Ticket>
  ) => {
    try {
      await updateTicket(userId, updates);
      setTickets((acc) => ({ ...acc, ...updates }));
      addNotification({
        type: "success",
        message: "Account updated successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to update account",
      });
      throw err;
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await deleteTicket(ticketId);
      setTickets(tickets.filter((acc) => acc.id !== ticketId));
      addNotification({
        type: "success",
        message: "Ticket deleted successfully",
      });
    } catch (err) {
      addNotification({
        type: "error",
        message: "Failed to delete ticket",
      });
      throw err;
    }
  };

  return {
    tickets,
    loading,
    error,
    handleCreateTicket,
    handleUpdateTicket,
    handleDeleteTicket,
  };
}
