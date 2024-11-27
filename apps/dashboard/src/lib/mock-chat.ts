import { Ticket } from './types';

// Initialize mock data
export function initializeMockData() {
  if (!localStorage.getItem('tickets')) {
    localStorage.setItem('tickets', '[]');
  }
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', '[]');
  }
}

// Mark a specific message as read
export function markMessageAsRead(ticketId: string, messageId: string) {
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  const updatedTickets = tickets.map(ticket => {
    if (ticket.id === ticketId) {
      return {
        ...ticket,
        messages: ticket.messages.map(message => 
          message.id === messageId ? { ...message, isRead: true } : message
        )
      };
    }
    return ticket;
  });
  localStorage.setItem('tickets', JSON.stringify(updatedTickets));

  // Update notifications
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const updatedNotifications = notifications.filter((n: any) => 
    !(n.type === 'message' && n.orderId === ticketId)
  );
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
}

// Mark a specific notification as read
export function markNotificationAsRead(notificationId: string) {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const updatedNotifications = notifications.filter((n: any) => n.id !== notificationId);
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
}

// Mark a proposal as read
export function markProposalAsRead(proposalId: string) {
  const proposals = JSON.parse(localStorage.getItem('proposals') || '[]');
  const updatedProposals = proposals.map((proposal: any) => 
    proposal.id === proposalId ? { ...proposal, isRead: true } : proposal
  );
  localStorage.setItem('proposals', JSON.stringify(updatedProposals));

  // Also remove any related notifications
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const updatedNotifications = notifications.filter((n: any) => n.proposalId !== proposalId);
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
}

// Mark all notifications as read
export function markAllNotificationsAsRead() {
  // Clear all notifications
  localStorage.setItem('notifications', '[]');
  
  // Mark all messages as read
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  const updatedTickets = tickets.map(ticket => ({
    ...ticket,
    messages: ticket.messages.map(message => ({
      ...message,
      isRead: true
    }))
  }));
  localStorage.setItem('tickets', JSON.stringify(updatedTickets));

  // Mark all proposals as read
  const proposals = JSON.parse(localStorage.getItem('proposals') || '[]');
  const updatedProposals = proposals.map(proposal => ({
    ...proposal,
    isRead: true
  }));
  localStorage.setItem('proposals', JSON.stringify(updatedProposals));
}

// Add a new notification
export function addNotification(notification: {
  type: 'message' | 'status' | 'proposal';
  message: string;
  orderId?: string;
  proposalId?: string;
}) {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const newNotification = {
    id: crypto.randomUUID(),
    ...notification,
    timestamp: new Date(),
    isRead: false
  };
  notifications.push(newNotification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Add a new message to a ticket
export function addMessage(ticketId: string, message: {
  senderId: string;
  senderName: string;
  content: string;
}) {
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  const updatedTickets = tickets.map(ticket => {
    if (ticket.id === ticketId) {
      const newMessage = {
        id: crypto.randomUUID(),
        ...message,
        timestamp: new Date(),
        isRead: false
      };
      return {
        ...ticket,
        messages: [...ticket.messages, newMessage],
        lastUpdated: new Date()
      };
    }
    return ticket;
  });
  localStorage.setItem('tickets', JSON.stringify(updatedTickets));

  // Add notification for the new message
  addNotification({
    type: 'message',
    message: `Nouveau message de ${message.senderName}`,
    orderId: ticketId
  });
}

// Create a new ticket
export function createTicket(ticket: Omit<Ticket, 'id' | 'messages' | 'lastUpdated'>) {
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  const newTicket: Ticket = {
    id: crypto.randomUUID(),
    ...ticket,
    messages: [],
    lastUpdated: new Date()
  };
  tickets.push(newTicket);
  localStorage.setItem('tickets', JSON.stringify(tickets));
  return newTicket;
}

// Get a ticket by ID
export function getTicket(ticketId: string): Ticket | undefined {
  const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');
  return tickets.find(ticket => ticket.id === ticketId);
}