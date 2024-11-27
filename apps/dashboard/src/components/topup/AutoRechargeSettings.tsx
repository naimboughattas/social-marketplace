import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import Switch from '../Switch';
import * as Dialog from '@radix-ui/react-dialog';
import { useNotifications } from '../../lib/notifications';

interface AutoRechargeSettings {
  enabled: boolean;
  amount: string;
  minimumBalance: string;
  monthlyLimit: string;
  paymentMethodId: string | null;
}

export default function AutoRechargeSettings() {
  const { addNotification } = useNotifications();
  const [settings, setSettings] = useState<AutoRechargeSettings>(() => {
    const saved = localStorage.getItem('autoRechargeSettings');
    return saved ? JSON.parse(saved) : {
      enabled: false,
      amount: '200',
      minimumBalance: '10',
      monthlyLimit: '5000',
      paymentMethodId: null
    };
  });
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [hasSubscriptions, setHasSubscriptions] = useState(false);

  // Vérifier si l'utilisateur a des abonnements actifs
  useEffect(() => {
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const activeSubscriptions = subscriptions.filter((sub: any) => sub.status === 'active');
    setHasSubscriptions(activeSubscriptions.length > 0);
  }, []);

  const handleToggle = (enabled: boolean) => {
    if (settings.enabled && !enabled && hasSubscriptions) {
      setShowDisableConfirm(true);
    } else {
      handleSaveSettings({ ...settings, enabled });
      addNotification({
        type: enabled ? 'success' : 'info',
        message: enabled ? 'Rechargement automatique activé' : 'Rechargement automatique désactivé'
      });
    }
  };

  const handleSaveSettings = (newSettings: AutoRechargeSettings) => {
    if (parseFloat(newSettings.amount) <= 0 || 
        parseFloat(newSettings.minimumBalance) <= 0 || 
        parseFloat(newSettings.monthlyLimit) <= 0) {
      addNotification({
        type: 'error',
        message: 'Veuillez entrer des montants valides'
      });
      return;
    }

    localStorage.setItem('autoRechargeSettings', JSON.stringify(newSettings));
    setSettings(newSettings);
    addNotification({
      type: 'success',
      message: 'Paramètres de rechargement automatique enregistrés'
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Rechargement automatique
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Activez le rechargement automatique pour ne jamais manquer de crédits
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onChange={handleToggle}
            label="Activer"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Montant du rechargement
            </label>
            <Input
              type="number"
              value={settings.amount}
              onChange={(e) => setSettings({ ...settings, amount: e.target.value })}
              placeholder="200"
              disabled={!settings.enabled}
              min="0"
            />
            <p className="mt-1 text-sm text-gray-500">
              Montant qui sera ajouté à votre compte lors du rechargement automatique
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Seuil minimum
            </label>
            <Input
              type="number"
              value={settings.minimumBalance}
              onChange={(e) => setSettings({ ...settings, minimumBalance: e.target.value })}
              placeholder="10"
              disabled={!settings.enabled}
              min="0"
            />
            <p className="mt-1 text-sm text-gray-500">
              Le rechargement s'effectuera lorsque votre solde passera sous ce montant
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Limite mensuelle
            </label>
            <Input
              type="number"
              value={settings.monthlyLimit}
              onChange={(e) => setSettings({ ...settings, monthlyLimit: e.target.value })}
              placeholder="5000"
              disabled={!settings.enabled}
              min="0"
            />
            <p className="mt-1 text-sm text-gray-500">
              Montant maximum de rechargements automatiques par mois
            </p>
          </div>

          {settings.enabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Paramètres actuels
              </h4>
              <p className="text-sm text-blue-700">
                Nous ajouterons {settings.amount}€ chaque fois que votre solde descendra en dessous de {settings.minimumBalance}€ 
                et nous ne dépasserons jamais {settings.monthlyLimit}€ par mois.
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={() => handleSaveSettings(settings)}
              disabled={!settings.enabled}
            >
              Enregistrer les paramètres
            </Button>
          </div>
        </div>
      </div>

      <Dialog.Root open={showDisableConfirm} onOpenChange={setShowDisableConfirm}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
              <div>
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Désactiver le rechargement automatique ?
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Vous avez des abonnements actifs qui nécessitent un solde suffisant pour continuer à fonctionner.
                    En désactivant le rechargement automatique :
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-500 list-disc list-inside">
                    <li>Vos abonnements seront interrompus si votre solde devient insuffisant</li>
                    <li>Vous devrez recharger manuellement votre compte</li>
                    <li>Vous risquez de manquer des interactions sur vos posts</li>
                  </ul>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDisableConfirm(false);
                    }}
                  >
                    Garder actif
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      handleSaveSettings({ ...settings, enabled: false });
                      setShowDisableConfirm(false);
                      addNotification({
                        type: 'info',
                        message: 'Rechargement automatique désactivé'
                      });
                    }}
                  >
                    Désactiver
                  </Button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}