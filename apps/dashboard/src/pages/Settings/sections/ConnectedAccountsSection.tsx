import { useState } from 'react';
import { useNotifications } from '../../../lib/notifications';
import Button from '../../../components/Button';
import { Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';
import { TikTok } from '../../../components/icons/TikTok';
import { Twitter } from '../../../components/icons/Twitter';

interface ConnectedAccount {
  id: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'x' | 'facebook' | 'linkedin';
  username: string;
  connected: Date;
  lastSync: Date;
}

export default function ConnectedAccountsSection() {
  const { addNotification } = useNotifications();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    {
      id: '1',
      platform: 'instagram',
      username: '@fashion_style',
      connected: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);

  const getPlatformIcon = (platform: ConnectedAccount['platform']) => {
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

  const handleConnect = async (platform: ConnectedAccount['platform']) => {
    try {
      // API call to connect account
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        message: 'Compte connecté avec succès'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la connexion du compte'
      });
    }
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir déconnecter ce compte ?')) return;

    try {
      // API call to disconnect account
      setAccounts(accounts.filter(account => account.id !== id));
      
      addNotification({
        type: 'success',
        message: 'Compte déconnecté'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la déconnexion du compte'
      });
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
        message: 'Erreur lors de la synchronisation du compte'
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Comptes connectés
      </h3>

      <div className="space-y-6">
        {/* Comptes connectés */}
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {getPlatformIcon(account.platform)}
              <div>
                <p className="font-medium text-gray-900">{account.username}</p>
                <p className="text-sm text-gray-500">
                  Connecté le {account.connected.toLocaleDateString()} •
                  Dernière synchro le {account.lastSync.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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

        {/* Plateformes disponibles */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {['instagram', 'tiktok', 'youtube', 'x', 'facebook', 'linkedin'].map((platform) => (
            <button
              key={platform}
              onClick={() => handleConnect(platform as ConnectedAccount['platform'])}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50"
            >
              {getPlatformIcon(platform as ConnectedAccount['platform'])}
              <span className="font-medium capitalize">
                {platform === 'x' ? 'Twitter' : platform}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}