import { useState } from 'react';
import { Share2, Bell, Search, ShoppingCart } from 'lucide-react';
import Button from '../Button';
import { cn } from '../../lib/utils';

interface ThemePreviewProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    borderRadius: string;
    buttonStyle: string;
  };
  translations: {
    [key: string]: string;
  };
}

export default function ThemePreview({ theme, translations }: ThemePreviewProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Appliquer dynamiquement le thème
  const style = {
    '--color-primary': theme.primaryColor,
    '--color-secondary': theme.secondaryColor,
    '--color-accent': theme.accentColor,
    '--font-family': theme.fontFamily,
    '--border-radius': theme.borderRadius,
    fontFamily: theme.fontFamily
  } as React.CSSProperties;

  const buttonClassName = cn(
    'px-4 py-2 font-medium transition-colors',
    {
      'rounded-none': theme.buttonStyle === 'square',
      'rounded-md': theme.buttonStyle === 'rounded',
      'rounded-full': theme.buttonStyle === 'pill'
    }
  );

  return (
    <div className="w-full h-[600px] bg-gray-50" style={style}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Share2 style={{ color: theme.primaryColor }} className="h-6 w-6" />
          <span className="font-bold text-lg">SocialBoost</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={translations['common.search'] || 'Rechercher...'}
              className="pl-10 pr-4 py-2 border rounded-lg"
              style={{ borderRadius: theme.borderRadius }}
            />
          </div>
          <Button
            style={{ backgroundColor: theme.primaryColor }}
            className={buttonClassName}
          >
            <Bell className="h-4 w-4 mr-2" />
            {translations['common.notifications'] || 'Notifications'}
          </Button>
          <Button
            variant="outline"
            className={buttonClassName}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {translations['common.cart'] || 'Panier'} (0)
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex h-[calc(100%-4rem)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-1">
            {[
              { key: 'nav.dashboard', icon: 'Home' },
              { key: 'nav.orders', icon: 'ShoppingBag' },
              { key: 'nav.customers', icon: 'Users' },
              { key: 'nav.settings', icon: 'Settings' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={cn(
                  'w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeTab === item.key
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
                style={{
                  borderRadius: theme.borderRadius,
                  '--tw-text-opacity': 1,
                  color: activeTab === item.key ? theme.primaryColor : undefined
                }}
              >
                <span>{translations[item.key] || item.key}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {translations['nav.dashboard'] || 'Dashboard'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {translations['dashboard.welcome'] || 'Bienvenue sur votre tableau de bord'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { key: 'stats.orders', value: '156' },
                { key: 'stats.revenue', value: '3,240 €' },
                { key: 'stats.customers', value: '1,234' }
              ].map((stat) => (
                <div
                  key={stat.key}
                  className="bg-white p-6 rounded-lg border border-gray-200"
                  style={{ borderRadius: theme.borderRadius }}
                >
                  <div className="text-sm font-medium text-gray-500">
                    {translations[stat.key] || stat.key}
                  </div>
                  <div className="mt-2 text-3xl font-bold" style={{ color: theme.primaryColor }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="bg-white p-6 rounded-lg border border-gray-200"
              style={{ borderRadius: theme.borderRadius }}
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                {translations['dashboard.recentActivity'] || 'Activité récente'}
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-10 h-10 rounded-full bg-gray-200"
                        style={{ borderRadius: theme.borderRadius }}
                      />
                      <div>
                        <div className="font-medium">John Doe</div>
                        <div className="text-sm text-gray-500">
                          {translations['activity.newOrder'] || 'Nouvelle commande'} #{i}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Il y a 2h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}