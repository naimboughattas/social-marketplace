import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, TextInput, Select, SelectItem } from '@tremor/react';
import { useNotifications } from '../../lib/notifications';

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  defaultLanguage: string;
  defaultCurrency: string;
  minWithdrawAmount: number;
  maxWithdrawAmount: number;
  commissionRate: number;
  tvaRate: number;
}

const defaultSettings: Settings = {
  siteName: 'SocialBoost',
  siteDescription: 'Plateforme de marketing d\'influence',
  contactEmail: 'contact@socialboost.com',
  supportEmail: 'support@socialboost.com',
  defaultLanguage: 'fr',
  defaultCurrency: 'EUR',
  minWithdrawAmount: 50,
  maxWithdrawAmount: 5000,
  commissionRate: 15,
  tvaRate: 20
};

export default function AdminSettings() {
  const { addNotification } = useNotifications();
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('admin_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('admin_settings', JSON.stringify(settings));
      
      addNotification({
        type: 'success',
        message: 'Paramètres enregistrés avec succès'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'enregistrement des paramètres'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Title>Paramètres</Title>
          <p className="mt-1 text-sm text-gray-500">
            Configurez les paramètres généraux de la plateforme
          </p>
        </div>

        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Paramètres généraux
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Nom du site"
                  value={settings.siteName}
                  onChange={(e) => setSettings({
                    ...settings,
                    siteName: e.target.value
                  })}
                />
                <TextInput
                  label="Description du site"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    siteDescription: e.target.value
                  })}
                />
                <TextInput
                  label="Email de contact"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({
                    ...settings,
                    contactEmail: e.target.value
                  })}
                />
                <TextInput
                  label="Email de support"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({
                    ...settings,
                    supportEmail: e.target.value
                  })}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Paramètres régionaux
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={settings.defaultLanguage}
                  onValueChange={(value) => setSettings({
                    ...settings,
                    defaultLanguage: value
                  })}
                >
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </Select>
                <Select
                  value={settings.defaultCurrency}
                  onValueChange={(value) => setSettings({
                    ...settings,
                    defaultCurrency: value
                  })}
                >
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </Select>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Paramètres financiers
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Montant minimum de retrait"
                  type="number"
                  value={settings.minWithdrawAmount}
                  onChange={(e) => setSettings({
                    ...settings,
                    minWithdrawAmount: parseFloat(e.target.value)
                  })}
                />
                <TextInput
                  label="Montant maximum de retrait"
                  type="number"
                  value={settings.maxWithdrawAmount}
                  onChange={(e) => setSettings({
                    ...settings,
                    maxWithdrawAmount: parseFloat(e.target.value)
                  })}
                />
                <TextInput
                  label="Taux de commission (%)"
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) => setSettings({
                    ...settings,
                    commissionRate: parseFloat(e.target.value)
                  })}
                />
                <TextInput
                  label="Taux de TVA (%)"
                  type="number"
                  value={settings.tvaRate}
                  onChange={(e) => setSettings({
                    ...settings,
                    tvaRate: parseFloat(e.target.value)
                  })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}