import { Info } from 'lucide-react';
import { Service } from '../../lib/types';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as RadioGroup from '@radix-ui/react-radio-group';

interface InteractionTypeStepProps {
  service: Service;
  interactionType: string;
  onInteractionTypeSelect: (type: string) => void;
}

const INTERACTION_TYPES = {
  follow: [
    {
      id: 'one-month',
      title: 'Suivi pendant 1 mois',
      description: 'L\'influenceur suivra le compte pendant 1 mois puis se désabonnera automatiquement'
    },
    {
      id: 'monthly',
      title: 'Renouveler le suivi tous les mois',
      description: 'L\'influenceur restera abonné et le montant sera automatiquement débité chaque mois'
    }
  ],
  other: [
    {
      id: 'specific',
      title: 'Posts spécifiques',
      description: 'Sélectionnez un ou plusieurs posts existants'
    },
    {
      id: 'specific-future',
      title: 'Posts spécifiques + Futurs posts',
      description: 'Sélectionnez des posts existants et recevez automatiquement des interactions sur vos futurs posts'
    },
    {
      id: 'future',
      title: 'Tous les futurs posts',
      description: 'Recevez automatiquement des interactions sur tous vos nouveaux posts'
    }
  ]
};

export default function InteractionTypeStep({
  service,
  interactionType,
  onInteractionTypeSelect
}: InteractionTypeStepProps) {
  const types = service === 'follow' ? INTERACTION_TYPES.follow : INTERACTION_TYPES.other;

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Type d'interaction</h3>
      <RadioGroup.Root
        value={interactionType}
        onValueChange={onInteractionTypeSelect}
        className="space-y-3"
      >
        {types.map((type) => (
          <RadioGroup.Item key={type.id} value={type.id} asChild>
            <div className={`relative flex items-start p-4 rounded-lg border-2 transition-colors cursor-pointer ${
              interactionType === type.id
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-200'
            }`}>
              <div className="flex h-5 items-center">
                <RadioGroup.Indicator className="h-5 w-5 rounded-full border-2 border-purple-600 flex items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-purple-600" />
                </RadioGroup.Indicator>
              </div>
              <div className="ml-3">
                <label className="font-medium text-gray-900">
                  {type.title}
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  {type.description}
                </p>
                {type.id === 'future' && (
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <div className="text-gray-400 hover:text-gray-600 cursor-pointer">
                          <Info className="h-4 w-4" />
                        </div>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="bg-gray-900 text-white px-3 py-2 rounded text-sm max-w-xs"
                          sideOffset={5}
                        >
                          Une commande sera automatiquement passée dès qu'un nouveau post est détecté
                          <Tooltip.Arrow className="fill-gray-900" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                )}
              </div>
            </div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  );
}