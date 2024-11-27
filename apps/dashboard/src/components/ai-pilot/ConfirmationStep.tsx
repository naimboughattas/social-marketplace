import { Service } from '../../lib/types';

interface Settings {
  category: string;
  country: string;
  city: string;
  language: string;
  quantity: number;
  budget: number;
}

interface ConfirmationStepProps {
  service: Service;
  target: string;
  settings: Settings;
  interactionType: string;
}

export default function ConfirmationStep({
  service,
  target,
  settings,
  interactionType
}: ConfirmationStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Confirmation</h3>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Paramètres sélectionnés</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Service :</span>{' '}
            <span className="font-medium capitalize">{service}</span>
          </div>
          <div>
            <span className="text-gray-500">Type :</span>{' '}
            <span className="font-medium">{interactionType}</span>
          </div>
          <div>
            <span className="text-gray-500">Cible :</span>{' '}
            <span className="font-medium">{target}</span>
          </div>
          <div>
            <span className="text-gray-500">Catégorie :</span>{' '}
            <span className="font-medium">{settings.category || 'Toutes'}</span>
          </div>
          <div>
            <span className="text-gray-500">Pays :</span>{' '}
            <span className="font-medium">{settings.country || 'Tous'}</span>
          </div>
          <div>
            <span className="text-gray-500">Ville :</span>{' '}
            <span className="font-medium">{settings.city || 'Toutes'}</span>
          </div>
          <div>
            <span className="text-gray-500">Langue :</span>{' '}
            <span className="font-medium">{settings.language || 'Toutes'}</span>
          </div>
          <div>
            <span className="text-gray-500">Quantité :</span>{' '}
            <span className="font-medium">{settings.quantity} influenceurs</span>
          </div>
          <div>
            <span className="text-gray-500">Budget :</span>{' '}
            <span className="font-medium">{settings.budget} €</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">
          Notre IA va :
        </h4>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• Sélectionner les influenceurs les plus pertinents selon vos critères</li>
          <li>• Optimiser la distribution de votre budget</li>
          <li>• Maximiser votre portée potentielle</li>
          <li>• Assurer une répartition équilibrée des interactions</li>
        </ul>
      </div>
    </div>
  );
}