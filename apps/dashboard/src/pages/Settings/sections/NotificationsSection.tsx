import { useState } from 'react';
import { useNotifications } from '../../../lib/notifications';
import Button from '../../../components/Button';
import Switch from '../../../components/Switch';

export default function NotificationsSection() {
  const { addNotification } = useNotifications();
  const [settings, setSettings] = useState({
    email: {
      orders: true,
      proposals: true,
      payments: true,
      support: true,
      marketing: false
    },
    push: {
      orders: true,
      proposals: true,
      payments: true,
      support: true,
      marketing: false
    },
    telegram: {
      enabled: false,
      username: ''
    }
  });

  const handleSave = async () => {
    try {
      // API call to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        message: 'Préférences de notification mises à jour'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la mise à jour des préférences'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications par email */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Notifications par email
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Commandes</p>
              <p className="text-sm text-gray-500">Mises à jour et changements de statut</p>
            </div>
            <Switch
              checked={settings.email.orders}
              onChange={(checked) => setSettings({
                ...settings,
                email: { ...settings.email, orders: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Propositions</p>
              <p className="text-sm text-gray-500">Nouvelles propositions reçues</p>
            </div>
            <Switch
              checked={settings.email.proposals}
              onChange={(checked) => setSettings({
                ...settings,
                email: { ...settings.email, proposals: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Paiements</p>
              <p className="text-sm text-gray-500">Reçus et confirmations</p>
            </div>
            <Switch
              checked={settings.email.payments}
              onChange={(checked) => setSettings({
                ...settings,
                email: { ...settings.email, payments: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Support</p>
              <p className="text-sm text-gray-500">Réponses à vos tickets</p>
            </div>
            <Switch
              checked={settings.email.support}
              onChange={(checked) => setSettings({
                ...settings,
                email: { ...settings.email, support: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Marketing</p>
              <p className="text-sm text-gray-500">Nouveautés et offres spéciales</p>
            </div>
            <Switch
              checked={settings.email.marketing}
              onChange={(checked) => setSettings({
                ...settings,
                email: { ...settings.email, marketing: checked }
              })}
            />
          </div>
        </div>
      </div>

      {/* Notifications push */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Notifications push
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Commandes</p>
              <p className="text-sm text-gray-500">Mises à jour et changements de statut</p>
            </div>
            <Switch
              checked={settings.push.orders}
              onChange={(checked) => setSettings({
                ...settings,
                push: { ...settings.push, orders: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Propositions</p>
              <p className="text-sm text-gray-500">Nouvelles propositions reçues</p>
            </div>
            <Switch
              checked={settings.push.proposals}
              onChange={(checked) => setSettings({
                ...settings,
                push: { ...settings.push, proposals: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Paiements</p>
              <p className="text-sm text-gray-500">Reçus et confirmations</p>
            </div>
            <Switch
              checked={settings.push.payments}
              onChange={(checked) => setSettings({
                ...settings,
                push: { ...settings.push, payments: checked }
              })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Support</p>
              <p className="text-sm text-gray-500">Réponses à vos tickets</p>
            </div>
            <Switch
              checked={settings.push.support}
              onChange={(checked) => setSettings({
                ...settings,
                push: { ...settings.push, support: checked }
              })}
            />
          </div>
        </div>
      </div>

      {/* Notifications Telegram */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Notifications Telegram
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Recevez vos notifications directement sur Telegram
            </p>
          </div>
          <Switch
            checked={settings.telegram.enabled}
            onChange={(checked) => setSettings({
              ...settings,
              telegram: { ...settings.telegram, enabled: checked }
            })}
          />
        </div>

        {settings.telegram.enabled && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              Pour activer les notifications Telegram :
            </p>
            <ol className="mt-2 text-sm text-blue-700 list-decimal list-inside space-y-1">
              <li>Ajoutez notre bot @SocialBoostBot sur Telegram</li>
              <li>Envoyez-lui la commande /start</li>
              <li>Il vous donnera un code de vérification à entrer ici</li>
            </ol>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Enregistrer les préférences
        </Button>
      </div>
    </div>
  );
}