import { ShoppingCart, X, UserPlus, Heart, MessageCircle, Share2, ExternalLink, Clock, RefreshCw } from 'lucide-react';
import { useCart, CartItem } from '../lib/cart';
import Button from './Button';
import { Link } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServiceIcon = ({ service }: { service: 'follow' | 'like' | 'comment' | 'repost_story' }) => {
  switch (service) {
    case 'follow':
      return <UserPlus className="h-4 w-4" />;
    case 'like':
      return <Heart className="h-4 w-4" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4" />;
    case 'repost_story':
      return <Share2 className="h-4 w-4" />;
  }
};

const getInteractionType = (item: CartItem) => {
  if (item.service === 'follow') {
    return item.isRecurring ? 'Renouvellement mensuel' : 'Suivi pendant 1 mois';
  }
  
  if (item.isFuturePosts) {
    return item.postUrl ? 'Post spécifique + futurs posts' : 'Tous les futurs posts';
  }
  
  return 'Post(s) spécifique(s)';
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, removeItem } = useCart();

  if (!isOpen) return null;

  const renderPostUrls = (item: CartItem) => {
    if (item.service === 'follow') return null;
    if (!item.postUrl) return null;

    // Si c'est un post unique
    if (!item.postUrl.includes('|')) {
      return (
        <a
          href={item.postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-purple-600 hover:text-purple-700 mt-1"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Voir le post
        </a>
      );
    }

    // Si c'est multiple posts
    const posts = item.postUrl.split('|');
    return (
      <div className="mt-2 space-y-1">
        <div className="text-sm text-gray-500 font-medium">Posts sélectionnés :</div>
        {posts.map((url, index) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-purple-600 hover:text-purple-700"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Post {index + 1}
          </a>
        ))}
      </div>
    );
  };

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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Votre panier est vide</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Commencez par ajouter des services à votre panier
                  </p>
                </div>
              ) : (
                <ul role="list" className="divide-y divide-gray-200">
                  {state.items.map((item: CartItem) => (
                    <li key={item.id} className="py-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <div className="flex items-center space-x-2">
                            <ServiceIcon service={item.service} />
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.influencerUsername}
                            </h3>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.price.toFixed(2)} €
                            {(item.isRecurring || item.isFuturePosts) && (
                              <span className="text-xs text-gray-500">
                                {item.isRecurring ? ' / mois' : ' / post'}
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className="capitalize">{item.service}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            {item.isRecurring || item.isFuturePosts ? (
                              <RefreshCw className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            <span>{getInteractionType(item)}</span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">
                          {item.service === 'follow' ? (
                            <span>Compte à suivre : {item.targetHandle}</span>
                          ) : (
                            <>
                              <div>Compte : {item.targetHandle}</div>
                              {renderPostUrls(item)}
                            </>
                          )}
                        </div>

                        {item.commentText && (
                          <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                            "{item.commentText}"
                          </div>
                        )}

                        <button
                          type="button"
                          className="text-sm font-medium text-purple-600 hover:text-purple-500"
                          onClick={() => removeItem(item.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
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