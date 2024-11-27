import { useState } from 'react';
import { Tab } from '@headlessui/react';
import DashboardLayout from '../../components/DashboardLayout';
import { cn } from '../../lib/utils';
import PaymentMethodList from '../../components/topup/PaymentMethodList';
import BillingProfileList from '../../components/topup/BillingProfileList';
import AutoRechargeSettings from '../../components/topup/AutoRechargeSettings';
import RechargeSection from './RechargeSection';

export default function TopUp() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gérer mes paiements</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos moyens de paiement et informations de facturation
          </p>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-purple-100 p-1">
            {['Recharger mon compte', 'Moyens de paiement', 'Profils de facturation', 'Rechargement automatique'].map((tab) => (
              <Tab
                key={tab}
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
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <RechargeSection onChangeTab={setSelectedTab} />
            </Tab.Panel>

            <Tab.Panel>
              <PaymentMethodList />
            </Tab.Panel>

            <Tab.Panel>
              <BillingProfileList />
            </Tab.Panel>

            <Tab.Panel>
              <AutoRechargeSettings />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </DashboardLayout>
  );
}