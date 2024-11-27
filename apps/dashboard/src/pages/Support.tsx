import { useState } from 'react';
import { Tab } from '@headlessui/react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, MessageSquare, Plus } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useSupport } from '../hooks/useSupport';
import { cn } from '../lib/utils';
import { formatDate } from '../lib/utils';

export default function Support() {
  const { tickets, loading, error, handleCreateTicket, handleSendMessage, handleCloseTicket } = useSupport();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState('');

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-7rem)] flex">
        {/* Tickets list */}
        <div className="w-96 border-r bg-white">
          <div className="p-4 border-b space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Tickets</h3>
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
                className={cn(
                  'w-full p-4 text-left hover:bg-gray-50',
                  selectedTicket?.id === ticket.id ? 'bg-purple-50' : ''
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {ticket.subject}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        ticket.status === 'open' ? 'bg-purple-100 text-purple-800' :
                        ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      )}>
                        {ticket.status === 'open' ? 'Ouvert' :
                         ticket.status === 'in_progress' ? 'En cours' :
                         'Fermé'}
                      </span>
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                        ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      )}>
                        {ticket.priority === 'high' ? 'Haute' :
                         ticket.priority === 'medium' ? 'Moyenne' :
                         'Basse'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 ml-4">
                    {formatDate(ticket.updatedAt)}
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
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      selectedTicket.status === 'open' ? 'bg-purple-100 text-purple-800' :
                      selectedTicket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {selectedTicket.status === 'open' ? 'Ouvert' :
                       selectedTicket.status === 'in_progress' ? 'En cours' :
                       'Fermé'}
                    </span>
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      selectedTicket.priority === 'high' ? 'bg-red-100 text-red-800' :
                      selectedTicket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    )}>
                      {selectedTicket.priority === 'high' ? 'Haute' :
                       selectedTicket.priority === 'medium' ? 'Moyenne' :
                       'Basse'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Créé le {formatDate(selectedTicket.createdAt)}
                    </span>
                  </div>
                </div>
                {selectedTicket.status !== 'closed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCloseTicket(selectedTicket.id)}
                  >
                    Fermer le ticket
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedTicket.messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className={cn(
                    'max-w-[80%] rounded-lg p-3',
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100'
                  )}>
                    <p className="text-sm">{msg.content}</p>
                    <p className={cn(
                      'text-xs mt-1',
                      msg.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                    )}>
                      {formatDate(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            {selectedTicket.status !== 'closed' && (
              <div className="p-4 border-t">
                <div className="flex space-x-4">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => {
                      if (!message.trim()) return;
                      handleSendMessage(selectedTicket.id, message);
                      setMessage('');
                    }}
                  >
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
                <Button 
                  onClick={async () => {
                    if (!newTicketSubject.trim()) return;
                    await handleCreateTicket(newTicketSubject);
                    setNewTicketSubject('');
                    setShowNewTicket(false);
                  }}
                >
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