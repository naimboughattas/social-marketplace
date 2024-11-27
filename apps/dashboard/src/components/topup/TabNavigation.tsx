import { Tab } from '@headlessui/react';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface TabNavigationProps {
  selectedIndex: number;
  onChange: (index: number) => void;
  hasSubscriptions?: boolean;
}

export default function TabNavigation({ selectedIndex, onChange, hasSubscriptions = false }: TabNavigationProps) {
  const tabs = [
    'Recharger mon compte',
    'Moyens de paiement',
    'Profils de facturation',
    'Rechargement automatique'
  ];

  return (
    <Tab.List className="flex space-x-1 rounded-xl bg-purple-100 p-1">
      {tabs.map((tab, index) => (
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
          <div className="flex items-center justify-center space-x-2">
            <span>{tab}</span>
            {index === 3 && hasSubscriptions && (
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div className="text-yellow-500">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded text-sm max-w-xs"
                      sideOffset={5}
                    >
                      Vous avez des abonnements actifs. Pour éviter toute interruption de service, 
                      nous vous recommandons d'activer le rechargement automatique.
                      <Tooltip.Arrow className="fill-yellow-50" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}
          </div>
        </Tab>
      ))}
    </Tab.List>
  );
}