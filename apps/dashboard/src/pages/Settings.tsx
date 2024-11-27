import { useState } from 'react';
import { Tab } from '@headlessui/react';
import DashboardLayout from '../components/DashboardLayout';
import { cn } from '../lib/utils';

import ProfileSection from './Settings/sections/ProfileSection';
import SecuritySection from './Settings/sections/SecuritySection';
import NotificationsSection from './Settings/sections/NotificationsSection';
import PaymentMethodsSection from './Settings/sections/PaymentMethodsSection';
import BillingProfilesSection from './Settings/sections/BillingProfilesSection';
import PreferencesSection from './Settings/sections/PreferencesSection';
import ApiKeysSection from './Settings/sections/ApiKeysSection';
import ConnectedAccountsSection from './Settings/sections/ConnectedAccountsSection';

export default function Settings() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos préférences et informations personnelles
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
              Profil
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
              Sécurité
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
              Notifications
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
              Paiements
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
              Avancé
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <ProfileSection />
            </Tab.Panel>

            <Tab.Panel>
              <SecuritySection />
            </Tab.Panel>

            <Tab.Panel>
              <NotificationsSection />
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <PaymentMethodsSection />
                <BillingProfilesSection />
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-6">
                <PreferencesSection />
                <ApiKeysSection />
                <ConnectedAccountsSection />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </DashboardLayout>
  );
}