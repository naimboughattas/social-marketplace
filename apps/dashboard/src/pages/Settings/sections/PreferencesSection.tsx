import { useState } from 'react';
import { useNotifications } from '../../../lib/notifications';
import Button from '../../../components/Button';
import Switch from '../../../components/Switch';

export default function PreferencesSection() {
  const { addNotification } = useNotifications();
  const [preferences, setPreferences] = useState({
    autoRecharge: false,
    autoRenewSubscriptions: true,
    darkMode: false,
    compactMode: false,
    soundEffects: true,
    desktopNotifications: true,
    emailDigest: 'daily'
  });

  const handleSave = async () => {
    try {
      // API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        message: 'Préférences enregistrées avec succès'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'enregistrement des préférences'
      });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Préférences
      </h3>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Rechargement automatique</p>
            <p className="text-sm text-gray-500">Recharger automatiquement votre compte quand le solde est bas</p>
          </div>
          <Switch
            checked={preferences.autoRecharge}
            onChange={(checked) => setPreferences({
              ...preferences,
              autoRecharge: checked
            })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Renouvellement automatique</p>
            <p className="text-sm text-gray-500">Renouveler automatiquement vos abonnements</p>
          </div>
          <Switch
            checked={preferences.autoRenewSubscriptions}
            onChange={(checked) => setPreferences({
              ...preferences,
              autoRenewSubscriptions: checked
            })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Mode sombre</p>
            <p className="text-sm text-gray-500">Utiliser le thème sombre</p>
          </div>
          <Switch
            checked={preferences.darkMode}
            onChange={(checked) => setPreferences({
              ...preferences,
              darkMode: checked
            })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Mode compact</p>
            <p className="text-sm text-gray-500">Réduire l'espacement entre les éléments</p>
          </div>
          <Switch
            checked={preferences.compactMode}
            onChange={(checked) => setPreferences({
              ...preferences,
              compactMode: checked
            })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Effets sonores</p>
            <p className="text-sm text-gray-500">Jouer des sons lors des notifications</p>
          </div>
          <Switch
            checked={preferences.soundEffects}
            onChange={(checked) => setPreferences({
              ...preferences,
              soundEffects: checked
            })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Notifications bureau</p>
            <p className="text-sm text-gray-500">Afficher les notifications sur le bureau</p>
          </div>
          <Switch
            checked={preferences.desktopNotifications}
            onChange={(checked) => setPreferences({
              ...preferences,
              desktopNotifications: checked
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Résumé par email
          </label>
          <select
            value={preferences.emailDigest}
            onChange={(e) => setPreferences({
              ...preferences,
              emailDigest: e.target.value
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="never">Jamais</option>
            <option value="daily">Quotidien</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuel</option>
          </select>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Enregistrer les préférences
          </Button>
        </div>
      </div>
    </div>
  );
}