import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Share2, Globe, Star, Clock, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart';
import { useNotifications } from '../lib/notifications';
import { mockInfluencers } from '../lib/mock-data';
import { Service, SocialAccount } from '../lib/types';
import PlatformIcon from '../components/PlatformIcon';
import ServiceIcon from '../components/ServiceIcon';

export default function PublicProfile() {
  const { platform, username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { addNotification } = useNotifications();
  const [influencer, setInfluencer] = useState<SocialAccount | null>(null);

  // Vérifier si l'utilisateur vient de la plateforme
  const isFromPlatform = location.key !== 'default';

  useEffect(() => {
    // Simulate API call to get influencer data
    const found = mockInfluencers.find(inf => 
      inf.username.toLowerCase().replace('@', '') === username?.toLowerCase()
    );
    setInfluencer(found || null);
  }, [username]);

  const handleAddToCart = (service: Service) => {
    if (!user) {
      // Save intended action in session storage
      sessionStorage.setItem('pendingAction', JSON.stringify({
        type: 'addToCart',
        service,
        influencerUsername: influencer?.username
      }));
      navigate('/login');
      return;
    }

    addItem({
      id: crypto.randomUUID(),
      influencerUsername: influencer?.username || '',
      service,
      price: influencer?.prices[service] || 0,
      targetHandle: '',
    });

    addNotification({
      type: 'success',
      message: 'Service ajouté au panier'
    });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      addNotification({
        type: 'success',
        message: 'Lien copié dans le presse-papier'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la copie du lien'
      });
    }
  };

  if (!influencer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Influenceur non trouvé</h2>
          <p className="mt-2 text-gray-600">
            L'influenceur que vous recherchez n'existe pas ou n'est plus disponible.
          </p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isFromPlatform && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              )}
              <div className="flex items-center space-x-2">
                <Share2 className="h-8 w-8 text-purple-600" />
                <span className="text-xl font-bold">SocialBoost</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleShare}>
                <Globe className="h-4 w-4 mr-2" />
                Partager
              </Button>
              {!user && (
                <Button onClick={() => navigate('/login')}>
                  Se connecter
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Cover image */}
          <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500" />

          {/* Profile info */}
          <div className="px-8 pb-8">
            <div className="flex justify-between -mt-12">
              <img
                src={influencer.profileImage}
                alt={influencer.displayName}
                className="h-24 w-24 rounded-full border-4 border-white"
              />
              <Button onClick={handleShare}>
                <Globe className="h-4 w-4 mr-2" />
                Partager le profil
              </Button>
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <PlatformIcon platform={influencer.platform} className="h-5 w-5" />
                <h1 className="text-2xl font-bold">{influencer.username}</h1>
              </div>
              <p className="mt-1 text-gray-600">{influencer.displayName}</p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-6 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(influencer.followers)}
                </div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">
                    {influencer.rating}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {influencer.completedOrders} avis
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">
                    {influencer.avgDeliveryTime}h
                  </span>
                </div>
                <div className="text-sm text-gray-500">Délai moyen</div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Services proposés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {influencer.availableServices.map((service) => (
                  <div
                    key={service}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <ServiceIcon service={service} />
                      <div>
                        <div className="font-medium capitalize">{service}</div>
                        <div className="text-sm text-gray-500">
                          {service === 'follow' ? 'Abonnement' :
                           service === 'like' ? 'Like sur un post' :
                           service === 'comment' ? 'Commentaire personnalisé' :
                           'Partage en story'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-medium">
                        {influencer.prices[service]?.toFixed(2)} €
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleAddToCart(service)}
                      >
                        Ajouter au panier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Catégories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {influencer.category.split(',').map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {cat.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Langues
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {influencer.language}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}