import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Slider from '@radix-ui/react-slider';
import Button from '../Button';
import { Service, SocialAccount, Platform } from '../../lib/types';
import { useCart } from '../../lib/cart';
import { useNotifications } from '../../lib/notifications';

interface AIResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  service: Service;
  target: string;
  maxBudget: number;
  interactionType: string;
  requestedQuantity: number;
  settings: {
    category: string;
    country: string;
    city: string;
    language: string;
  };
  platform: Platform;
  influencers: SocialAccount[];
}

export default function AIResultsModal({
  isOpen,
  onClose,
  onBack,
  service,
  target,
  maxBudget,
  interactionType,
  requestedQuantity,
  settings,
  platform,
  influencers
}: AIResultsModalProps) {
  const { addItem } = useCart();
  const { addNotification } = useNotifications();
  const [quantity, setQuantity] = useState(requestedQuantity);

  // Filtrer les influenceurs disponibles selon les critères
  const availableInfluencers = influencers.filter(inf => {
    // Vérifier que le service est disponible et a un prix
    if (!inf.availableServices.includes(service) || !inf.prices[service]) {
      return false;
    }

    // Appliquer les filtres si spécifiés
    if (settings.category && settings.category !== inf.category) {
      return false;
    }
    if (settings.country && settings.country !== inf.country) {
      return false;
    }
    if (settings.city && settings.city !== inf.city) {
      return false;
    }
    if (settings.language && settings.language !== inf.language) {
      return false;
    }

    return true;
  });

  // Trier les influenceurs par meilleur ratio engagement/prix
  const sortedInfluencers = [...availableInfluencers].sort((a, b) => {
    const scoreA = (a.followers * a.rating) / (a.prices[service] || 1);
    const scoreB = (b.followers * b.rating) / (b.prices[service] || 1);
    return scoreB - scoreA;
  });

  // Sélectionner les meilleurs influenceurs dans la limite du budget
  const selectedInfluencers = [];
  let totalCost = 0;
  let totalReach = 0;

  for (const inf of sortedInfluencers) {
    const price = inf.prices[service] || 0;
    if (selectedInfluencers.length < quantity && totalCost + price <= maxBudget) {
      selectedInfluencers.push(inf);
      totalCost += price;
      totalReach += inf.followers;
    }
  }

  const isRecurring = service === 'follow' && interactionType === 'monthly' || 
                     service !== 'follow' && (interactionType === 'specific-future' || interactionType === 'future');

  const handleAddToCart = () => {
    selectedInfluencers.forEach(influencer => {
      addItem({
        id: crypto.randomUUID(),
        influencerUsername: influencer.username,
        service,
        price: influencer.prices[service] || 0,
        targetHandle: target,
        isFuturePosts: interactionType === 'future' || interactionType === 'specific-future',
        isRecurring: service === 'follow' && interactionType === 'monthly'
      }, true);
    });

    addNotification({
      type: 'success',
      message: `${selectedInfluencers.length} service(s) ajouté(s) à votre panier`
    });

    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-[5%] left-1/2 -translate-x-1/2 bg-white rounded-lg p-6 w-full max-w-4xl h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <Dialog.Title className="text-lg font-medium">
                Résultats de l'IA pour {platform}
              </Dialog.Title>
            </div>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Nombre d'influenceurs
                </label>
                <span className="text-sm font-medium text-purple-600">
                  {selectedInfluencers.length} sur {sortedInfluencers.length} disponibles
                </span>
              </div>
              <div className="py-4">
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[quantity]}
                  max={Math.min(sortedInfluencers.length, requestedQuantity)}
                  min={1}
                  step={1}
                  onValueChange={([value]) => setQuantity(value)}
                >
                  <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
                    <Slider.Range className="absolute bg-purple-600 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block w-5 h-5 bg-white shadow-lg border-2 border-purple-600 rounded-full hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    aria-label="Nombre d'influenceurs"
                  />
                </Slider.Root>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-1">Influenceurs</h4>
                <p className="text-2xl font-bold text-purple-700">
                  {selectedInfluencers.length}
                </p>
                <p className="text-sm text-purple-600">
                  sur {sortedInfluencers.length} disponibles
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">Budget utilisé</h4>
                <p className="text-2xl font-bold text-green-700">
                  {totalCost.toFixed(2)} €
                </p>
                <p className="text-sm text-green-600">
                  {isRecurring ? (
                    service === 'follow' ? 'par mois' : 'par nouveau post'
                  ) : 'paiement unique'}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Portée potentielle</h4>
                <p className="text-2xl font-bold text-blue-700">
                  {(totalReach / 1000).toFixed(1)}K
                </p>
                <p className="text-sm text-blue-600">
                  followers cumulés
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Influenceur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Followers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Prix
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedInfluencers.map((influencer) => (
                    <tr key={influencer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={influencer.profileImage}
                            alt={influencer.username}
                            className="h-8 w-8 rounded-full"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {influencer.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {influencer.followers.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">
                            {influencer.prices[service]?.toFixed(2)} €
                          </span>
                          {isRecurring && (
                            <span className="text-gray-500 ml-1">
                              {service === 'follow' ? '/ mois' : '/ post'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="outline"
                onClick={onBack}
              >
                Retour
              </Button>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button onClick={handleAddToCart}>
                  Ajouter au panier ({selectedInfluencers.length})
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}