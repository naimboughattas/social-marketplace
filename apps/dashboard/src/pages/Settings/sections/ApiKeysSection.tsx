import { useState } from 'react';
import { useNotifications } from '../../../lib/notifications';
import Button from '../../../components/Button';
import { Copy, Eye, EyeOff } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed: Date | null;
}

export default function ApiKeysSection() {
  const { addNotification } = useNotifications();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk_live_123456789',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState('');

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      addNotification({
        type: 'error',
        message: 'Veuillez entrer un nom pour la clé'
      });
      return;
    }

    try {
      // API call to create new key
      const newKey: ApiKey = {
        id: crypto.randomUUID(),
        name: newKeyName,
        key: `sk_live_${Math.random().toString(36).substring(2)}`,
        createdAt: new Date(),
        lastUsed: null
      };

      setApiKeys([...apiKeys, newKey]);
      setNewKeyName('');
      
      addNotification({
        type: 'success',
        message: 'Nouvelle clé API créée'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la création de la clé'
      });
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    addNotification({
      type: 'success',
      message: 'Clé API copiée dans le presse-papier'
    });
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir révoquer cette clé ?')) return;

    try {
      // API call to revoke key
      setApiKeys(apiKeys.filter(key => key.id !== id));
      
      addNotification({
        type: 'success',
        message: 'Clé API révoquée'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la révocation de la clé'
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Clés API
      </h3>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Nom de la clé"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
          <Button onClick={handleCreateKey}>
            Créer une nouvelle clé
          </Button>
        </div>

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                <div className="mt-1 flex items-center space-x-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                    {showKey[apiKey.id] ? apiKey.key : '••••••••••••••••'}
                  </code>
                  <button
                    onClick={() => handleCopyKey(apiKey.key)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowKey({
                      ...showKey,
                      [apiKey.id]: !showKey[apiKey.id]
                    })}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showKey[apiKey.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Créée le {apiKey.createdAt.toLocaleDateString()} •
                  {apiKey.lastUsed
                    ? ` Dernière utilisation le ${apiKey.lastUsed.toLocaleDateString()}`
                    : ' Jamais utilisée'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleRevokeKey(apiKey.id)}
              >
                Révoquer
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}