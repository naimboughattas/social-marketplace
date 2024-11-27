import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useNotifications } from '../lib/notifications';
import {
  createTicket,
  getTickets,
  addMessage,
  closeTicket
} from '../lib/firebase/support';

export function useSupport() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      try {
        setLoading(true);
        const fetchedTickets = await getTickets(user.id);
        setTickets(fetchedTickets);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load tickets');
        addNotification({
          type: 'error',
          message: 'Failed to load support tickets'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const handleCreateTicket = async (subject: string) => {
    if (!user) return;

    try {
      const ticketId = await createTicket({
        userId: user.id,
        subject,
        priority: 'medium'
      });

      const newTicket = {
        id: ticketId,
        subject,
        status: 'open',
        priority: 'medium',
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: []
      };

      setTickets([newTicket, ...tickets]);
      
      addNotification({
        type: 'success',
        message: 'Support ticket created successfully'
      });

      return ticketId;
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to create support ticket'
      });
      throw err;
    }
  };

  const handleSendMessage = async (ticketId: string, content: string) => {
    if (!user) return;

    try {
      await addMessage(ticketId, {
        sender: 'user',
        content
      });

      setTickets(tickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            messages: [
              ...ticket.messages,
              {
                id: crypto.randomUUID(),
                sender: 'user',
                content,
                timestamp: new Date()
              }
            ],
            updatedAt: new Date()
          };
        }
        return ticket;
      }));

      addNotification({
        type: 'success',
        message: 'Message sent successfully'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to send message'
      });
      throw err;
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    try {
      await closeTicket(ticketId);
      
      setTickets(tickets.map(ticket => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            status: 'closed',
            updatedAt: new Date()
          };
        }
        return ticket;
      }));

      addNotification({
        type: 'success',
        message: 'Ticket closed successfully'
      });
    } catch (err) {
      addNotification({
        type: 'error',
        message: 'Failed to close ticket'
      });
      throw err;
    }
  };

  return {
    tickets,
    loading,
    error,
    handleCreateTicket,
    handleSendMessage,
    handleCloseTicket
  };
}