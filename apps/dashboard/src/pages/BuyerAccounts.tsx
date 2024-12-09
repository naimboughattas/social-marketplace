import { useState } from 'react';
import { Plus, Search, Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';
import { TikTok } from '../components/icons/TikTok';
import { Twitter } from '../components/icons/Twitter';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import { Platform } from '../lib/types';
import { useNotifications } from '../lib/notifications';
import ConnectAccountModal from '../components/connect/ConnectAccountModal';

interface ConnectedAccount {
  id: string;
  platform: Platform;
  username: string;
  profileImage: string;
  followers: number;
  isVerified: boolean;
  connectedAt: Date;
  lastSync: Date;
}

export default function BuyerAccounts() {
  const { addNotification } = useNotifications();
  const [search, setSearch] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    {
      id: '1',
      platform: 'instagram',
      username: '@your_business',
      profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
      followers: 5432,
      isVerified: true,
      connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'tiktok':
        return <TikTok className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-600" />;
      case 'x':
        return <Twitter className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5 text-blue-700" />;
    }
  };

  const handleSync = async (id: string) => {
    try {
      // API call to sync account
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAccounts(accounts.map(account =>
        account.id === id
          ? { ...account, lastSync: new Date() }
          : account
      ));
      
      addNotification({
        type: 'success',
        message: 'Compte synchronisé avec succès'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la synchronisation'
      });
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir déconnecter ce compte ?')) return;

    try {
      // API call to disconnect account
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAccounts(accounts.filter(account => account.id !== id));
      
      addNotification({
        type: 'success',
        message: 'Compte déconnecté avec succès'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la déconnexion'
      });
    }
  };

  const handleConnect = async (platform: Platform) => {
    try {
      // API call to connect account
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAccount: ConnectedAccount = {
        id: crypto.randomUUID(),
        platform,
        username: '@new_account',
        profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
        followers: 0,
        isVerified: false,
        connectedAt: new Date(),
        lastSync: new Date()
      };
      
      setAccounts([...accounts, newAccount]);
      
      addNotification({
        type: 'success',
        message: 'Compte connecté avec succès'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la connexion'
      });
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.username.toLowerCase().includes(search.toLowerCase())
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mes comptes</h2>
            <p className="mt-1 text-sm text-gray-500">
              Gérez les comptes pour lesquels vous pouvez passer des commandes
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un compte..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowConnectModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Connecter un compte
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAccounts.map((account) => (
            <div
              key={account.id}
              className="bg-white shadow rounded-lg p-6"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={account.profileImage}
                  alt={account.username}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(account.platform)}
                    <span className="font-medium">{account.username}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatNumber(account.followers)} followers
                  </p>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Connecté le</span>
                  <span>{account.connectedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Dernière synchro</span>
                  <span>{account.lastSync.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSync(account.id)}
                >
                  Synchroniser
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDisconnect(account.id)}
                >
                  Déconnecter
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Instagram />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun compte connecté</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par connecter un compte pour pouvoir passer des commandes
            </p>
            <div className="mt-6">
              <Button onClick={() => setShowConnectModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Connecter un compte
              </Button>
            </div>
          </div>
        )}

        <ConnectAccountModal
          isOpen={showConnectModal}
          onClose={() => setShowConnectModal(false)}
          onConnect={handleConnect}
        />
      </div>
    </DashboardLayout>
  );
}