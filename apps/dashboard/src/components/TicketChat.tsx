import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../lib/auth';
import { formatDate } from '../lib/utils';
import { addMessage, createTicket, getTicket } from '../lib/mock-chat';
import { markMessageAsRead } from '../lib/mock-chat';

interface TicketChatProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: number;
  recipientId: string;
  recipientName: string;
}

export default function TicketChat({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  recipientId,
  recipientName
}: TicketChatProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Get or create ticket
      let currentTicket = getTicket(orderId);
      if (!currentTicket) {
        currentTicket = createTicket({
          orderId,
          orderNumber,
          messages: []
        });
      }
      setTicket(currentTicket);

      // Mark unread messages as read
      if (currentTicket) {
        currentTicket.messages.forEach((msg: any) => {
          if (!msg.isRead && msg.senderId !== user?.id) {
            markMessageAsRead(currentTicket.id, msg.id);
          }
        });
      }
    }
  }, [isOpen, orderId, orderNumber, user?.id]);

  // Refresh ticket data periodically
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        const updatedTicket = getTicket(orderId);
        if (updatedTicket) {
          setTicket(updatedTicket);
          // Mark new messages as read
          updatedTicket.messages.forEach((msg: any) => {
            if (!msg.isRead && msg.senderId !== user?.id) {
              markMessageAsRead(updatedTicket.id, msg.id);
            }
          });
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, orderId, user?.id]);

  const handleSend = () => {
    if (!message.trim() || !user) return;

    addMessage(orderId, {
      senderId: user.id,
      senderName: user.email,
      content: message.trim()
    });

    setMessage('');

    // Refresh ticket immediately
    const updatedTicket = getTicket(orderId);
    if (updatedTicket) {
      setTicket(updatedTicket);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">
            Conversation #{orderNumber}
          </h3>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {ticket?.messages.map((msg: any) => {
            const isSender = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isSender
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    isSender ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {formatDate(new Date(msg.timestamp))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Votre message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button onClick={handleSend} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}