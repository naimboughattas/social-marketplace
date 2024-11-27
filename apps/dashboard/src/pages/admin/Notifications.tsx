import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, TextInput, Select, SelectItem } from '@tremor/react';
import { Search, Bell, Send, Users } from 'lucide-react';
import Button from '../../components/Button';
import { useNotifications } from '../../lib/notifications';
import { formatDate } from '../../lib/utils';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error';
  target: 'all' | 'buyers' | 'sellers' | 'specific';
  targetUsers?: string[];
  scheduledFor?: Date;
  sent: boolean;
  sentAt?: Date;
  createdAt: Date;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nouvelle fonctionnalité',
    content: 'Découvrez notre nouveau système de récompenses !',
    type: 'info',
    target: 'all',
    sent: true,
    sentAt: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 172800000)
  }
];

export default function AdminNotifications() {
  const { addNotification } = useNotifications();
  const [notifications] = useState(mockNotifications);
  const [search, setSearch] = useState('');
  const [showNewNotification, setShowNewNotification] = useState(false);
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    type: 'info',
    target: 'all'
  });

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.content) {
      addNotification({
        type: 'error',
        message: 'Veuillez remplir tous les champs obligatoires'
      });
      return;
    }

    // Send notification logic here
    setShowNewNotification(false);
    addNotification({
      type: 'success',
      message: 'Notification envoyée avec succès'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title>Notifications</Title>
          <div className="flex space-x-4">
            <TextInput
              icon={Search}
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={() => setShowNewNotification(true)}>
              Nouvelle notification
            </Button>
          </div>
        </div>

        <Card>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 border rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-purple-500" />
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.content}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {notification.target}
                    </span>
                    {notification.sent ? (
                      <span className="text-sm text-gray-500">
                        Envoyée le {formatDate(notification.sentAt!)}
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {}}
                      >
                        Envoyer maintenant
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Modal nouvelle notification */}
        {showNewNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Nouvelle notification
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Titre
                  </label>
                  <TextInput
                    value={newNotification.title || ''}
                    onChange={(e) => setNewNotification({
                      ...newNotification,
                      title: e.target.value
                    })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Contenu
                  </label>
                  <textarea
                    value={newNotification.content || ''}
                    onChange={(e) => setNewNotification({
                      ...newNotification,
                      content: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value) => setNewNotification({
                      ...newNotification,
                      type: value as any
                    })}
                  >
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cible
                  </label>
                  <Select
                    value={newNotification.target}
                    onValueChange={(value) => setNewNotification({
                      ...newNotification,
                      target: value as any
                    })}
                  >
                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                    <SelectItem value="buyers">Acheteurs uniquement</SelectItem>
                    <SelectItem value="sellers">Vendeurs uniquement</SelectItem>
                    <SelectItem value="specific">Utilisateurs spécifiques</SelectItem>
                  </Select>
                </div>

                {newNotification.target === 'specific' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Utilisateurs
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <TextInput
                        placeholder="Email de l'utilisateur"
                        className="flex-1"
                      />
                      <Button variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Planification
                  </label>
                  <TextInput
                    type="datetime-local"
                    value={newNotification.scheduledFor?.toISOString().slice(0, 16) || ''}
                    onChange={(e) => setNewNotification({
                      ...newNotification,
                      scheduledFor: e.target.value ? new Date(e.target.value) : undefined
                    })}
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewNotification(false)}
                  >
                    Annuler
                  </Button>
                  <Button onClick={handleSendNotification}>
                    <Send className="h-4 w-4 mr-2" />
                    {newNotification.scheduledFor ? 'Planifier' : 'Envoyer'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}