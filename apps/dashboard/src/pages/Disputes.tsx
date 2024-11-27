import { useState } from 'react';
import { Search, AlertTriangle, MessageSquare, X, Check } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import { formatDate } from '../lib/utils';

interface Dispute {
  id: string;
  orderNumber: number;
  date: Date;
  service: 'follow' | 'like' | 'comment' | 'repost_story';
  influencer: {
    username: string;
    avatar: string;
  };
  reason: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  messages: {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
  }[];
}

const mockDisputes: Dispute[] = [
  {
    id: '1',
    orderNumber: 123,
    date: new Date(),
    service: 'follow',
    influencer: {
      username: '@fashion_style',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'
    },
    reason: 'Le follow n\'a pas été maintenu pendant la durée prévue',
    status: 'pending',
    messages: [
      {
        id: '1',
        sender: 'user',
        content: 'L\'influenceur s\'est désabonné après seulement 2 jours au lieu des 30 jours prévus.',
        timestamp: new Date(Date.now() - 3600000)
      }
    ]
  },
  {
    id: '2',
    orderNumber: 124,
    date: new Date(Date.now() - 86400000),
    service: 'comment',
    influencer: {
      username: '@tech_guru',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'
    },
    reason: 'Le commentaire ne correspond pas à ce qui était demandé',
    status: 'resolved',
    messages: [
      {
        id: '2',
        sender: 'user',
        content: 'Le commentaire posté ne correspond pas du tout à ma demande.',
        timestamp: new Date(Date.now() - 172800000)
      },
      {
        id: '3',
        sender: 'support',
        content: 'Nous avons vérifié et effectivement le commentaire ne respecte pas les consignes. Un remboursement a été effectué.',
        timestamp: new Date(Date.now() - 86400000)
      }
    ]
  }
];

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'En attente',
  in_progress: 'En cours',
  resolved: 'Résolu',
  rejected: 'Rejeté'
};

export default function Disputes() {
  const [disputes] = useState<Dispute[]>(mockDisputes);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const filteredDisputes = disputes.filter(dispute =>
    dispute.orderNumber.toString().includes(search) ||
    dispute.influencer.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim() || !selectedDispute) return;
    // Add message logic here
    setMessage('');
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-7rem)] flex">
        {/* Disputes list */}
        <div className="w-96 border-r bg-white">
          <div className="p-4 border-b">
            <Input
              placeholder="Rechercher un litige..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="overflow-y-auto h-[calc(100%-5rem)]">
            {filteredDisputes.map((dispute) => (
              <button
                key={dispute.id}
                onClick={() => setSelectedDispute(dispute)}
                className={`w-full p-4 text-left hover:bg-gray-50 ${
                  selectedDispute?.id === dispute.id ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <img
                      src={dispute.influencer.avatar}
                      alt={dispute.influencer.username}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        Commande #{dispute.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {dispute.influencer.username}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusStyles[dispute.status]
                  }`}>
                    {statusLabels[dispute.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {dispute.reason}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDate(dispute.date)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Dispute details */}
        {selectedDispute ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Litige #{selectedDispute.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedDispute.influencer.username} • {formatDate(selectedDispute.date)}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  statusStyles[selectedDispute.status]
                }`}>
                  {statusLabels[selectedDispute.status]}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {selectedDispute.reason}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedDispute.messages.map((msg) => (
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
            {selectedDispute.status !== 'resolved' && (
              <div className="p-4 border-t">
                <div className="flex space-x-4">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    Envoyer
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Aucun litige sélectionné
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Sélectionnez un litige pour voir les détails
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}