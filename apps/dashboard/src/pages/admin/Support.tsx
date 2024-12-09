import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Card, Title, TextInput, Select, SelectItem } from '@tremor/react';
import { Search, MessageSquare, Shield, Ban } from 'lucide-react';
import Button from '../../components/Button';
import { cn } from '../../lib/utils';
import { Platform, PLATFORMS, PLATFORM_LABELS } from '../../lib/types';
import { useNotifications } from '../../lib/notifications';
import PlatformIcon from '../../components/PlatformIcon';
import AdminLayout from '../../components/admin/AdminLayout';

interface SuspendedAccount {
  id: string;
  username: string;
  platform: Platform;
  email: string;
  reason: string;
  suspendedAt: Date;
  suspendedBy: string;
}

export default function AdminSupport() {
  const { addNotification } = useNotifications();
  const [selectedTab, setSelectedTab] = useState(0);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState<Platform | 'all'>('all');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [showSuspendForm, setShowSuspendForm] = useState(false);

  // Mock data for suspended accounts
  const [suspendedAccounts, setSuspendedAccounts] = useState<SuspendedAccount[]>([
    {
      id: '1',
      username: '@suspended_user',
      platform: 'instagram',
      email: 'suspended@example.com',
      reason: 'Violation des conditions d\'utilisation',
      suspendedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      suspendedBy: 'admin@example.com'
    }
  ]);

  const handleSuspendAccount = () => {
    if (!username || !platform || platform === 'all' || !reason) {
      addNotification({
        type: 'error',
        message: 'Veuillez remplir tous les champs requis'
      });
      return;
    }

    const newAccount: SuspendedAccount = {
      id: crypto.randomUUID(),
      username,
      platform,
      email: email || 'Non spécifié',
      reason,
      suspendedAt: new Date(),
      suspendedBy: 'admin@example.com'
    };

    setSuspendedAccounts([newAccount, ...suspendedAccounts]);
    setShowSuspendForm(false);
    setUsername('');
    setEmail('');
    setPlatform('all');
    setReason('');

    addNotification({
      type: 'success',
      message: 'Compte suspendu avec succès'
    });
  };

  const handleUnsuspendAccount = (id: string) => {
    setSuspendedAccounts(suspendedAccounts.filter(account => account.id !== id));
    addNotification({
      type: 'success',
      message: 'Compte réactivé avec succès'
    });
  };

  const filteredAccounts = suspendedAccounts.filter(account => {
    if (search && !account.username.toLowerCase().includes(search.toLowerCase()) &&
        !account.email.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Title>Support</Title>
          <p className="mt-1 text-sm text-gray-500">
            Gérez le support client et la modération
          </p>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-purple-100 p-1">
            <Tab
              className={({ selected }) =>
                cn(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-purple-700 shadow'
                    : 'text-purple-600 hover:bg-white/[0.12] hover:text-purple-800'
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Tickets</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-purple-700 shadow'
                    : 'text-purple-600 hover:bg-white/[0.12] hover:text-purple-800'
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Modération</span>
              </div>
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-purple-700 shadow'
                    : 'text-purple-600 hover:bg-white/[0.12] hover:text-purple-800'
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <Ban className="h-4 w-4" />
                <span>Comptes suspendus</span>
              </div>
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-4">
            {/* Tickets Panel */}
            <Tab.Panel>
              <Card>
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Gestion des tickets
                  </h3>
                </div>
              </Card>
            </Tab.Panel>

            {/* Moderation Panel */}
            <Tab.Panel>
              <Card>
                <div className="text-center py-12">
                  <Shield className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Modération du contenu
                  </h3>
                </div>
              </Card>
            </Tab.Panel>

            {/* Suspended Accounts Panel */}
            <Tab.Panel>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <TextInput
                      icon={Search}
                      placeholder="Rechercher un compte..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => setShowSuspendForm(true)}>
                    <Ban className="h-4 w-4 mr-2" />
                    Suspendre un compte
                  </Button>
                </div>

                {showSuspendForm && (
                  <Card>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Plateforme
                          </label>
                          <Select
                            value={platform}
                            onValueChange={(value) => setPlatform(value as Platform)}
                          >
                            <SelectItem value="all">Sélectionner une plateforme</SelectItem>
                            {PLATFORMS.map((p) => (
                              <SelectItem key={p} value={p}>
                                {PLATFORM_LABELS[p]}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nom d'utilisateur
                          </label>
                          <TextInput
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="@username"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email (optionnel)
                        </label>
                        <TextInput
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="email@exemple.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Motif de la suspension
                        </label>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                          rows={3}
                          placeholder="Raison de la suspension..."
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowSuspendForm(false)}
                        >
                          Annuler
                        </Button>
                        <Button onClick={handleSuspendAccount}>
                          Suspendre le compte
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                <Card>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plateforme
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilisateur
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Motif
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAccounts.map((account) => (
                          <tr key={account.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <PlatformIcon platform={account.platform} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {account.username}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {account.email}
                            </td>
                            <td className="px-6 py-4">
                              {account.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {account.suspendedAt.toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnsuspendAccount(account.id)}
                              >
                                Réactiver
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredAccounts.length === 0 && (
                      <div className="text-center py-12">
                        <Ban className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          Aucun compte suspendu
                        </h3>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </AdminLayout>
  );
}