import { useState } from 'react';
import { Search, MessageSquare, Plus } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { formatDate } from '../lib/utils';
import { useNotifications } from '../lib/notifications';

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  lastUpdate: Date;
  messages: {
    id: string;
    sender: 'user' | 'support';
    content: string;
    timestamp: Date;
  }[];
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    subject: 'Question sur le système de paiement',
    status: 'open',
    priority: 'medium',
    createdAt: new Date(Date.now() - 86400000),
    lastUpdate: new Date(Date.now() - 3600000),
    messages: [
      {
        id: '1',
        sender: 'user',
        content: 'Bonjour, j\'aimerais savoir comment fonctionne le système de paiement automatique ?',
        timestamp: new Date(Date.now() - 86400000)
      },
      {
        id: '2',
        sender: 'support',
        content: 'Bonjour ! Le système de paiement automatique permet de recharger automatiquement votre compte lorsque votre solde passe sous un certain seuil. Vous pouvez configurer ce seuil et le montant de rechargement dans vos paramètres.',
        timestamp: new Date(Date.now() - 3600000)
      }
    ]
  },
  {
    id: '2',
    subject: 'Problème de vérification de compte',
    status: 'closed',
    priority: 'high',
    createdAt: new Date(Date.now() - 172800000),
    lastUpdate: new Date(Date.now() - 86400000),
    messages: [
      {
        id: '3',
        sender: 'user',
        content: 'Je n\'arrive pas à valider mon compte Instagram, le code ne fonctionne pas.',
        timestamp: new Date(Date.now() - 172800000)
      },
      {
        id: '4',
        sender: 'support',
        content: 'Nous avons résolu le problème. Vous pouvez maintenant réessayer la vérification.',
        timestamp: new Date(Date.now() - 86400000)
      }
    ]
  }
];

const priorityStyles = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const priorityLabels = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute'
};

const statusStyles = {
  open: 'bg-purple-100 text-purple-800',
  closed: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  open: 'Ouvert',
  closed: 'Fermé'
};

export default function Messages() {
  const { addNotification } = useNotifications();
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!message.trim() || !selectedTicket) return;

    const newMessage = {
      id: crypto.randomUUID(),
      sender: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          messages: [...ticket.messages, newMessage],
          lastUpdate: new Date()
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    setMessage('');
    addNotification({
      type: 'success',
      message: 'Message envoyé'
    });
  };

  const handleCreateTicket = () => {
    if (!newTicketSubject.trim()) {
      addNotification({
        type: 'error',
        message: 'Veuillez entrer un sujet'
      });
      return;
    }

    const newTicket: Ticket = {
      id: crypto.randomUUID(),
      subject: newTicketSubject,
      status: 'open',
      priority: 'medium',
      createdAt: new Date(),
      lastUpdate: new Date(),
      messages: []
    };

    setTickets([newTicket, ...tickets]);
    setNewTicketSubject('');
    setShowNewTicket(false);
    setSelectedTicket(newTicket);
    addNotification({
      type: 'success',
      message: 'Ticket créé avec succès'
    });
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-7rem)] flex">
        {/* Tickets list */}
        <div className="w-96 border-r bg-white">
          <div className="p-4 border-b space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Support</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNewTicket(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau ticket
              </Button>
            </div>
            <Input
              placeholder="Rechercher un ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="overflow-y-auto h-[calc(100%-7rem)]">
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full p-4 text-left hover:bg-gray-50 ${
                  selectedTicket?.id === ticket.id ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {ticket.subject}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        statusStyles[ticket.status]
                      }`}>
                        {statusLabels[ticket.status]}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        priorityStyles[ticket.priority]
                      }`}>
                        {priorityLabels[ticket.priority]}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 ml-4">
                    {formatDate(ticket.lastUpdate)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {selectedTicket ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Ticket header */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-medium text-gray-900">
                    {selectedTicket.subject}
                  </h2>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      statusStyles[selectedTicket.status]
                    }`}>
                      {statusLabels[selectedTicket.status]}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      priorityStyles[selectedTicket.priority]
                    }`}>
                      {priorityLabels[selectedTicket.priority]}
                    </span>
                    <span className="text-xs text-gray-500">
                      Créé le {formatDate(selectedTicket.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {formatDate(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            {selectedTicket.status === 'open' && (
              <div className="p-4 border-t">
                <div className="flex space-x-4">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSend}>
                    Envoyer
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucun ticket sélectionné
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Sélectionnez un ticket pour voir la conversation
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New ticket modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Nouveau ticket
            </h3>
            <div className="space-y-4">
              <Input
                label="Sujet"
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
                placeholder="Décrivez brièvement votre problème"
                required
              />
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNewTicket(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleCreateTicket}>
                  Créer le ticket
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}