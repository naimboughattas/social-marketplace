import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { useAuth } from '../lib/auth';
import Button from '../components/Button';
import { Instagram, AlertCircle, UserPlus, Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import BalanceHeader from '../components/BalanceHeader';
import { useNotifications } from '../lib/notifications';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function Checkout() {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const { user, updateBalance } = useAuth();
  const { addNotification } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Don't render anything while checking authentication
  if (!user) {
    return null;
  }

  const handleCheckout = async () => {
    if (!user || user.balance < state.total) {
      navigate('/dashboard/topup');
      return;
    }

    setIsProcessing(true);

    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Créer les nouvelles commandes
      const newOrders = state.items.map(item => ({
        id: crypto.randomUUID(),
        date: new Date(),
        platform: 'instagram',
        influencer: item.influencerUsername,
        service: item.service,
        target: item.service === 'follow' ? item.targetHandle : item.postUrl,
        status: 'pending',
        price: item.price,
      }));

      // Sauvegarder les commandes dans le localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, ...newOrders]));
      
      // Update user's balance
      updateBalance(-state.total);
      
      // Clear cart and redirect
      clearCart();
      
      addNotification({
        type: 'success',
        message: 'Commande effectuée avec succès'
      });

      navigate('/dashboard/orders');
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors du paiement'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <Instagram className="mx-auto h-12 w-12 text-purple-600" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Votre panier est vide</h2>
          <p className="mt-1 text-sm text-gray-500">Ajoutez des services à votre panier</p>
          <Button
            className="mt-6"
            onClick={() => navigate('/dashboard/buy')}
          >
            Parcourir les services
          </Button>
        </div>
      </div>
    );
  }

  const insufficientFunds = user.balance < state.total;
  const currentBalance = user.balance || 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <BalanceHeader />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Récapitulatif de la commande</h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {insufficientFunds && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Solde insuffisant
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>
                          Votre solde actuel ({currentBalance.toFixed(2)} €) est insuffisant pour cette commande ({state.total.toFixed(2)} €).
                          Veuillez recharger votre compte pour continuer.
                        </p>
                        <Button
                          className="mt-3"
                          onClick={() => navigate('/dashboard/topup')}
                        >
                          Recharger mon compte
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {state.items.map((item) => (
                <div key={item.id} className="flex justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {item.service === 'follow' && <UserPlus className="h-4 w-4" />}
                      {item.service === 'like' && <Heart className="h-4 w-4" />}
                      {item.service === 'comment' && <MessageCircle className="h-4 w-4" />}
                      {item.service === 'repost_story' && <Share2 className="h-4 w-4" />}
                      <span className="font-medium">{item.influencerUsername}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="capitalize">{item.service}</span>
                      <span className="mx-2">•</span>
                      {item.service === 'follow' ? (
                        <span>{item.targetHandle}</span>
                      ) : (
                        <Tooltip.Provider>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button className="inline-flex items-center hover:text-purple-600">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Voir le post
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className="bg-gray-900 text-white px-2 py-1 rounded text-sm max-w-xs break-all"
                                sideOffset={5}
                              >
                                {item.postUrl}
                                <Tooltip.Arrow className="fill-gray-900" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </Tooltip.Provider>
                      )}
                    </div>
                    {item.service === 'comment' && item.commentText && (
                      <div className="text-sm text-gray-600 bg-white p-2 rounded">
                        "{item.commentText}"
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.price.toFixed(2)} €</p>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">
                    {state.total.toFixed(2)} €
                  </p>
                </div>
              </div>

              <Button
                className="w-full"
                disabled={isProcessing || insufficientFunds}
                onClick={handleCheckout}
              >
                {isProcessing ? 'Traitement en cours...' : 'Confirmer la commande'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}