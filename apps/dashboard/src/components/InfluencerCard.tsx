import { CheckCircle, Star, Heart } from 'lucide-react';
import Button from './Button';
import PlatformIcon from './PlatformIcon';
import ServiceIcon from './ServiceIcon';
import { Platform, Service } from '../lib/types';
import { useFavorites } from '../lib/favorites';
import * as Tooltip from '@radix-ui/react-tooltip';

interface InfluencerCardProps {
  id: string;
  platform: Platform;
  username: string;
  displayName: string;
  profileImage: string;
  followers: number;
  category: string;
  country: string;
  city: string;
  language: string;
  isVerified: boolean;
  prices: Record<Service, number>;
  availableServices: Service[];
  avgDeliveryTime: number;
  completedOrders: number;
  rating: number;
  selected?: boolean;
  multiSelectMode?: boolean;
  onSelect?: () => void;
  onAction: (service: Service) => void;
}

export default function InfluencerCard({
  id,
  platform,
  username,
  displayName,
  profileImage,
  followers,
  category,
  country,
  city,
  isVerified,
  prices,
  availableServices,
  avgDeliveryTime,
  completedOrders,
  rating,
  selected = false,
  multiSelectMode = false,
  onSelect,
  onAction
}: InfluencerCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(id);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? mins : ''}`;
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering multiselect
    if (favorite) {
      removeFavorite(id);
    } else {
      addFavorite({
        id,
        platform,
        username,
        displayName,
        profileImage,
        followers,
        category,
        country,
        city,
        language,
        isVerified,
        prices,
        availableServices,
        avgDeliveryTime,
        completedOrders,
        rating,
        isActive: true,
        hideIdentity: false
      });
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 ${
        multiSelectMode ? 'cursor-pointer hover:bg-gray-50' : ''
      } ${selected ? 'ring-2 ring-purple-500 bg-purple-50' : ''}`}
      onClick={() => multiSelectMode && onSelect?.()}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={profileImage}
          alt={username}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <PlatformIcon platform={platform} className="h-4 w-4" />
            <span className="font-medium">{username}</span>
            {isVerified && <CheckCircle className="h-4 w-4 text-blue-500" />}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{category}</span>
            <span>•</span>
            <span>{city}, {country}</span>
          </div>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Heart
            className={`h-5 w-5 ${
              favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="font-medium">{formatNumber(followers)}</div>
          <div className="text-gray-500 text-xs">Followers</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="flex items-center justify-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="font-medium">{rating}</span>
          </div>
          <div className="text-gray-500 text-xs">{completedOrders} avis</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="font-medium">{formatTime(avgDeliveryTime)}</div>
          <div className="text-gray-500 text-xs">Délai moyen</div>
        </div>
      </div>

      {/* Services */}
      <div className="grid grid-cols-4 gap-2">
        {availableServices.map((service) => (
          <Tooltip.Provider key={service}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => !multiSelectMode && onAction(service)}
                  disabled={multiSelectMode}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                    multiSelectMode 
                      ? 'bg-gray-100 cursor-not-allowed'
                      : 'bg-gray-50 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  <ServiceIcon service={service} className="h-5 w-5 mb-1" />
                  <span className="text-sm font-medium">{prices[service]}€</span>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
                  sideOffset={5}
                >
                  Commander un {service}
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}
      </div>
    </div>
  );
}