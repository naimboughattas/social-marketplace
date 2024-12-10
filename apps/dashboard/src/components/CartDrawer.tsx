import { ShoppingCart, X, UserPlus, Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart, CartItem } from '../lib/cart';
import Button from './Button';
import ServiceIcon from './ServiceIcon';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const getServiceLabel = (service: string) => {
  switch (service) {
    case 'follow':
      return 'Follow';
    case 'like':
      return 'Like';
    case 'comment':
      return 'Comment';
    case 'repost_story':
      return 'Repost';
    default:
      return service;
  }
};

const getInteractionTypeLabel = (item: CartItem) => {
  if (item.service === 'follow') {
    return item.isRecurring ? 'Renouvellement mensuel' : 'Suivi pendant 1 mois';
  }

  if (item.isFuturePosts) {
    return item.postUrl ? 'Posts spécifiques + Futurs posts' : 'Futurs posts';
  }

  return 'Post(s) spécifique(s)';
};

const getPriceLabel = (item: CartItem) => {
  if (item.service === 'follow') {
    return item.isRecurring ? '/ mois' : 'pour 1 mois';
  }
  return '/ post';
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, removeItem } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-6 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Panier</h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              {state.items.length === 0 ? (
                <div className="text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Votre panier est vide
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Commencez par ajouter des services à votre panier
                  </p>
                </div>
              ) : (
                <ul role="list" className="divide-y divide-gray-200">
                  {state.items.map((item) => {
                    const postUrls = item.postUrl?.split('|').filter(url => url.trim() !== '') || [];
                    const totalPrice = item.price * (postUrls.length || 1);

                    return (
                      <li key={item.id} className="py-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <div className="flex items-center space-x-2">
                              <ServiceIcon service={item.service} />
                              <h3 className="text-sm font-medium text-gray-900">
                                {item.influencerUsername}
                              </h3>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.price.toFixed(2)}€ {getPriceLabel(item)}
                              {postUrls.length > 1 && item.service !== 'follow' && (
                                <span className="text-gray-500 text-xs ml-1">
                                  × {postUrls.length} = {totalPrice.toFixed(2)}€
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Service :</span>
                              <span>{getServiceLabel(item.service)}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Type :</span>
                              <span>{getInteractionTypeLabel(item)}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Compte cible :</span>
                              <span>{item.targetHandle}</span>
                            </div>

                            {item.service !== 'follow' && postUrls.length > 0 && (
                              <div className="space-y-1">
                                <span className="font-medium">Publication(s) :</span>
                                {postUrls.map((url, index) => (
                                  <div key={index} className="flex items-center pl-2">
                                    <ExternalLink className="h-4 w-4 mr-1 text-purple-600" />
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-purple-600 hover:text-purple-700 truncate"
                                    >
                                      {url}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}

                            {item.commentText && (
                              <div className="mt-2 bg-gray-50 p-2 rounded-lg">
                                <span className="font-medium">Commentaire :</span>
                                <p className="mt-1">"{item.commentText}"</p>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            className="text-sm font-medium text-purple-600 hover:text-purple-500"
                            onClick={() => removeItem(item.id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {state.items.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>{state.total.toFixed(2)} €</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  TVA incluse.
                </p>
                <div className="mt-6">
                  <Link to="/checkout">
                    <Button className="w-full" onClick={onClose}>
                      Commander
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}