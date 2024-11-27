import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { AlertCircle } from 'lucide-react';
import PaymentMethodList from '../components/topup/PaymentMethodList';
import BillingProfileList from '../components/topup/BillingProfileList';
import AutoRechargeSettings from '../components/topup/AutoRechargeSettings';
import RechargeSection from './TopUp/RechargeSection';
import TabNavigation from '../components/topup/TabNavigation';

export default function TopUp() {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(() => {
    // Si on arrive avec le paramètre tab=auto-recharge, sélectionner l'onglet de rechargement automatique
    return location.search === '?tab=auto-recharge' ? 3 : 0;
  });
  const [hasSubscriptions, setHasSubscriptions] = useState(false);
  const [hasAutoRecharge, setHasAutoRecharge] = useState(false);

  // Vérifier si l'utilisateur a des abonnements actifs et le rechargement automatique
  useEffect(() => {
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const activeSubscriptions = subscriptions.filter((sub: any) => sub.status === 'active');
    setHasSubscriptions(activeSubscriptions.length > 0);

    const autoRechargeSettings = JSON.parse(localStorage.getItem('autoRechargeSettings') || '{}');
    setHasAutoRecharge(autoRechargeSettings.enabled || false);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gérer mes paiements</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos moyens de paiement et informations de facturation
          </p>
        </div>

        {hasSubscriptions && !hasAutoRecharge && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Abonnements actifs détectés
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Vous avez des abonnements actifs qui nécessitent un solde suffisant pour continuer à fonctionner.
                    Pour éviter toute interruption de service, nous vous recommandons :
                  </p>
                  <ul className="list-disc list-inside mt-2">
                    <li>D'activer le rechargement automatique</li>
                    <li>De maintenir un solde suffisant sur votre compte</li>
                  </ul>
                  <button 
                    className="mt-3 text-purple-600 hover:text-purple-700 font-medium"
                    onClick={() => setSelectedTab(3)}
                  >
                    Activer le rechargement automatique →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <TabNavigation 
            selectedIndex={selectedTab} 
            onChange={setSelectedTab}
            hasSubscriptions={hasSubscriptions && !hasAutoRecharge}
          />

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