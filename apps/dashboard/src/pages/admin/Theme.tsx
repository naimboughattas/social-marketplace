import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, TextInput, Select, SelectItem, Tab, TabList, TabGroup, TabPanel, TabPanels } from '@tremor/react';
import { Search, Trophy, Star, Target, Gift, Globe, Bell, Zap, Palette } from 'lucide-react';
import Button from '../../components/Button';
import { useNotifications } from '../../lib/notifications';
import { cn } from '../../lib/utils';
import ThemePreview from '../../components/admin/ThemePreview';

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

const defaultTranslations = {
  fr: {
    'nav.dashboard': 'Tableau de bord',
    'nav.orders': 'Commandes',
    'nav.customers': 'Clients',
    'nav.influencers': 'Influenceurs',
    'nav.payments': 'Paiements',
    'nav.settings': 'Paramètres',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.add': 'Ajouter',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.search': 'Rechercher...',
    'common.notifications': 'Notifications',
    'common.cart': 'Panier',
    'auth.login': 'Connexion',
    'auth.signup': 'Inscription',
    'auth.logout': 'Déconnexion',
    'dashboard.welcome': 'Bienvenue sur votre tableau de bord',
    'dashboard.recentActivity': 'Activité récente',
    'activity.newOrder': 'Nouvelle commande',
    'stats.orders': 'Commandes',
    'stats.revenue': 'Chiffre d\'affaires',
    'stats.customers': 'Clients'
  },
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.orders': 'Orders',
    'nav.customers': 'Customers',
    'nav.influencers': 'Influencers',
    'nav.payments': 'Payments',
    'nav.settings': 'Settings',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search...',
    'common.notifications': 'Notifications',
    'common.cart': 'Cart',
    'auth.login': 'Login',
    'auth.signup': 'Sign up',
    'auth.logout': 'Logout',
    'dashboard.welcome': 'Welcome to your dashboard',
    'dashboard.recentActivity': 'Recent Activity',
    'activity.newOrder': 'New order',
    'stats.orders': 'Orders',
    'stats.revenue': 'Revenue',
    'stats.customers': 'Customers'
  }
};

const defaultTheme = {
  primaryColor: '#9333ea',
  secondaryColor: '#4f46e5',
  accentColor: '#ec4899',
  fontFamily: 'Inter',
  borderRadius: '0.5rem',
  buttonStyle: 'rounded'
};

export default function AdminTheme() {
  const { addNotification } = useNotifications();
  const [translations, setTranslations] = useState(defaultTranslations);
  const [theme, setTheme] = useState(defaultTheme);
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [newKey, setNewKey] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [showAddKey, setShowAddKey] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState('fr');

  const handleSaveTheme = async () => {
    try {
      localStorage.setItem('theme', JSON.stringify(theme));
      
      // Apply theme changes
      const root = document.documentElement;
      root.style.setProperty('--color-primary', theme.primaryColor);
      root.style.setProperty('--color-secondary', theme.secondaryColor);
      root.style.setProperty('--color-accent', theme.accentColor);
      root.style.setProperty('--font-family', theme.fontFamily);
      root.style.setProperty('--border-radius', theme.borderRadius);
      
      addNotification({
        type: 'success',
        message: 'Thème enregistré avec succès'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'enregistrement du thème'
      });
    }
  };

  const handleSaveTranslations = async () => {
    try {
      localStorage.setItem('translations', JSON.stringify(translations));
      addNotification({
        type: 'success',
        message: 'Traductions enregistrées avec succès'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'enregistrement des traductions'
      });
    }
  };

  const handleAddTranslationKey = () => {
    if (!newKey || !newTranslation) {
      addNotification({
        type: 'error',
        message: 'Veuillez remplir tous les champs'
      });
      return;
    }

    const updatedTranslations = { ...translations };
    Object.keys(translations).forEach(lang => {
      updatedTranslations[lang][newKey] = lang === selectedLanguage ? newTranslation : '';
    });

    setTranslations(updatedTranslations);
    setNewKey('');
    setNewTranslation('');
    setShowAddKey(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Title>Thème et traductions</Title>
          <p className="mt-1 text-sm text-gray-500">
            Personnalisez l'apparence et les textes de la plateforme
          </p>
        </div>

        <TabGroup>
          <TabList>
            <Tab>Apparence</Tab>
            <Tab>Traductions</Tab>
            <Tab>Prévisualisation</Tab>
          </TabList>

          <TabPanels>
            {/* Apparence */}
            <TabPanel>
              <Card>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Couleurs
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Couleur principale
                        </label>
                        <div className="mt-1 flex items-center space-x-2">
                          <input
                            type="color"
                            value={theme.primaryColor}
                            onChange={(e) => setTheme({
                              ...theme,
                              primaryColor: e.target.value
                            })}
                            className="h-8 w-8 rounded border border-gray-300"
                          />
                          <TextInput
                            value={theme.primaryColor}
                            onChange={(e) => setTheme({
                              ...theme,
                              primaryColor: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Couleur secondaire
                        </label>
                        <div className="mt-1 flex items-center space-x-2">
                          <input
                            type="color"
                            value={theme.secondaryColor}
                            onChange={(e) => setTheme({
                              ...theme,
                              secondaryColor: e.target.value
                            })}
                            className="h-8 w-8 rounded border border-gray-300"
                          />
                          <TextInput
                            value={theme.secondaryColor}
                            onChange={(e) => setTheme({
                              ...theme,
                              secondaryColor: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Couleur d'accent
                        </label>
                        <div className="mt-1 flex items-center space-x-2">
                          <input
                            type="color"
                            value={theme.accentColor}
                            onChange={(e) => setTheme({
                              ...theme,
                              accentColor: e.target.value
                            })}
                            className="h-8 w-8 rounded border border-gray-300"
                          />
                          <TextInput
                            value={theme.accentColor}
                            onChange={(e) => setTheme({
                              ...theme,
                              accentColor: e.target.value
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Typographie
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        value={theme.fontFamily}
                        onValueChange={(value) => setTheme({
                          ...theme,
                          fontFamily: value
                        })}
                      >
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Interface
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Rayon des bordures
                        </label>
                        <Select
                          value={theme.borderRadius}
                          onValueChange={(value) => setTheme({
                            ...theme,
                            borderRadius: value
                          })}
                        >
                          <SelectItem value="0">Carré</SelectItem>
                          <SelectItem value="0.25rem">Léger (4px)</SelectItem>
                          <SelectItem value="0.5rem">Moyen (8px)</SelectItem>
                          <SelectItem value="1rem">Large (16px)</SelectItem>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Style des boutons
                        </label>
                        <Select
                          value={theme.buttonStyle}
                          onValueChange={(value: any) => setTheme({
                            ...theme,
                            buttonStyle: value
                          })}
                        >
                          <SelectItem value="square">Carré</SelectItem>
                          <SelectItem value="rounded">Arrondi</SelectItem>
                          <SelectItem value="pill">Pilule</SelectItem>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveTheme}>
                      Enregistrer le thème
                    </Button>
                  </div>
                </div>
              </Card>
            </TabPanel>

            {/* Traductions */}
            <TabPanel>
              <Card>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Select
                        value={selectedLanguage}
                        onValueChange={setSelectedLanguage}
                      >
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </Select>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddKey(true)}
                      >
                        Ajouter une clé
                      </Button>
                    </div>
                    <Button onClick={handleSaveTranslations}>
                      Enregistrer les traductions
                    </Button>
                  </div>

                  {showAddKey && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Nouvelle clé de traduction</h4>
                        <button onClick={() => setShowAddKey(false)}>
                          <X className="h-5 w-5 text-gray-400" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <TextInput
                          placeholder="Clé (ex: common.save)"
                          value={newKey}
                          onChange={(e) => setNewKey(e.target.value)}
                        />
                        <TextInput
                          placeholder="Traduction"
                          value={newTranslation}
                          onChange={(e) => setNewTranslation(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleAddTranslationKey}>
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {Object.entries(translations[selectedLanguage] || {}).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-4">
                        <div className="text-sm font-medium text-gray-500">
                          {key}
                        </div>
                        <TextInput
                          value={value}
                          onChange={(e) => {
                            const updatedTranslations = { ...translations };
                            updatedTranslations[selectedLanguage][key] = e.target.value;
                            setTranslations(updatedTranslations);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabPanel>

            {/* Prévisualisation */}
            <TabPanel>
              <Card>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Prévisualisation
                    </h3>
                    <div className="flex items-center space-x-4">
                      <Select
                        value={previewLanguage}
                        onValueChange={setPreviewLanguage}
                        icon={Globe}
                      >
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </Select>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <ThemePreview
                      theme={theme}
                      translations={translations[previewLanguage]}
                    />
                  </div>
                </div>
              </Card>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </AdminLayout>
  );
}