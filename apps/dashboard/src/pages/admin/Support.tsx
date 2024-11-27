import { useState } from 'react';
import { Tab } from '@headlessui/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, TextInput, Select, SelectItem } from '@tremor/react';
import { Search, MessageSquare, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../components/Button';
import { cn } from '../../lib/utils';
import { formatDate } from '../../lib/utils';

interface Ticket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
  lastUpdate: Date;
  messages: {
    id: string;
    sender: 'user' | 'admin';
    content: string;
    timestamp: Date;
  }[];
}

const mockTickets: Ticket[] = [
  {
    id: '1',
    userId: 'user1',
    userEmail: 'user@example.com',
    subject: 'Problème de paiement',
    status: 'open',
    priority: 'high',
    category: 'payment',
    createdAt: new Date(Date.now() - 86400000),
    lastUpdate: new Date(Date.now() - 3600000),
    messages: [
      {
        id: '1',
        sender: 'user',
        content: 'Mon paiement est bloqué depuis hier',
        timestamp: new Date(Date.now() - 86400000)
      }
    ]
  }
  // ... autres tickets
];

const statusStyles = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800'
};

const priorityStyles = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

export default function AdminSupport() {
  const [tickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredTickets = tickets.filter(ticket => {
    if (search && !ticket.subject.toLowerCase().includes(search.toLowerCase()) &&
        !ticket.userEmail.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && ticket.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && ticket.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && ticket.category !== categoryFilter) return false;
    return true;
  });

  const handleSendMessage = () => {
    if (!message.trim() || !selectedTicket) return;
    // Add message logic here
    setMessage('');
  };

  const handleUpdateStatus = (ticketId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    // Update status logic here
  };

  const handleUpdatePriority = (ticketId: string, priority: 'low' | 'medium' | 'high') => {
    // Update priority logic here
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title>Support</Title>
          <div className="flex space-x-4">
            <TextInput
              icon={Search}
              placeholder="Rechercher un ticket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="open">Ouverts</SelectItem>
              <SelectItem value="in_progress">En cours</SelectItem>
              <SelectItem value="resolved">Résolus</SelectItem>
              <SelectItem value="closed">Fermés</SelectItem>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectItem value="all">Toutes les priorités</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Liste des tickets */}
          <div className="col-span-4">
            <Card>
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      'w-full p-4 text-left rounded-lg border transition-colors',
                      selectedTicket?.id === ticket.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-200'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                        <p className="text-sm text-gray-500">{ticket.userEmail}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          statusStyles[ticket.status]
                        )}>
                          {ticket.status}
                        </span>
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          priorityStyles[ticket.priority]
                        )}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {formatDate(ticket.lastUpdate)}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Détails du ticket */}
          <div className="col-span-8">
            {selectedTicket ? (
              <Card>
                <div className="space-y-6">
                  {/* En-tête */}
                  <div className="flex justify-between items-start border-b pb-4">
                    <div>
                      <h2 className="text-xl font-medium text-gray-900">
                        {selectedTicket.subject}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedTicket.userEmail} • {formatDate(selectedTicket.createdAt)}
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <Select
                        value={selectedTicket.priority}
                        onValueChange={(value) => handleUpdatePriority(selectedTicket.id, value as any)}
                      >
                        <SelectItem value="low">Basse</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Haute</SelectItem>
                      </Select>
                      <Select
                        value={selectedTicket.status}
                        onValueChange={(value) => handleUpdateStatus(selectedTicket.id, value as any)}
                      >
                        <SelectItem value="open">Ouvert</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="resolved">Résolu</SelectItem>
                        <SelectItem value="closed">Fermé</SelectItem>
                      </Select>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedTicket.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'flex',
                          msg.sender === 'admin' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div className={cn(
                          'max-w-[80%] rounded-lg p-4',
                          msg.sender === 'admin'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100'
                        )}>
                          <p>{msg.content}</p>
                          <p className={cn(
                            'text-xs mt-1',
                            msg.sender === 'admin' ? 'text-purple-200' : 'text-gray-500'
                          )}>
                            {formatDate(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex space-x-4">
                    <TextInput
                      placeholder="Votre réponse..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage}>
                      Envoyer
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Aucun ticket sélectionné
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Sélectionnez un ticket pour voir les détails
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}