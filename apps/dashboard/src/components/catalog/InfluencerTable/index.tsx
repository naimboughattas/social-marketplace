import { useState } from 'react';
import { UserPlus, Heart, MessageCircle, Share2 } from 'lucide-react';
import { SocialAccount, Service } from '../../../lib/types';
import ServiceCell from './ServiceCell';
import InfluencerCell from './InfluencerCell';
import TableHeader from './TableHeader';
import { useFavorites } from '../../../lib/favorites';
import InfluencerProfileModal from '../InfluencerProfileModal';

interface InfluencerTableProps {
  influencers: SocialAccount[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
  onServiceSelect: (influencer: SocialAccount, service: Service) => void;
  multiSelectMode?: boolean;
  selectedInfluencers?: string[];
}

export default function InfluencerTable({
  influencers,
  sortField,
  sortDirection,
  onSort,
  onServiceSelect,
  multiSelectMode = false,
  selectedInfluencers = []
}: InfluencerTableProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [selectedInfluencer, setSelectedInfluencer] = useState<SocialAccount | null>(null);

  const handleFavoriteClick = (e: React.MouseEvent, influencer: SocialAccount) => {
    e.stopPropagation(); // Prevent triggering multiselect
    if (isFavorite(influencer.id)) {
      removeFavorite(influencer.id);
    } else {
      addFavorite(influencer);
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader
            multiSelectMode={multiSelectMode}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {influencers.map((influencer) => (
              <tr 
                key={influencer.id}
                className={multiSelectMode ? 'cursor-pointer hover:bg-gray-50' : ''}
                onClick={() => {
                  if (multiSelectMode) {
                    onServiceSelect(influencer, 'follow');
                  }
                }}
              >
                {multiSelectMode && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedInfluencers.includes(influencer.id)}
                      onChange={() => onServiceSelect(influencer, 'follow')}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </td>
                )}
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={(e) => handleFavoriteClick(e, influencer)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorite(influencer.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </button>
                </td>

                <InfluencerCell
                  profileImage={influencer.profileImage}
                  username={influencer.username}
                  displayName={influencer.displayName}
                  category={influencer.category}
                  isVerified={influencer.isVerified}
                  platform={influencer.platform}
                  onProfileClick={() => setSelectedInfluencer(influencer)}
                />

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {influencer.city}, {influencer.country}
                </td>

                {multiSelectMode ? (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-baseline space-x-1">
                      <span className="font-medium">{influencer.prices.follow?.toFixed(2)}€</span>
                      <span className="text-xs text-gray-500">/ mois</span>
                    </div>
                  </td>
                ) : (
                  <>
                    <ServiceCell
                      price={influencer.prices.follow}
                      icon={UserPlus}
                      onClick={() => onServiceSelect(influencer, 'follow')}
                      service="follow"
                    />
                    <ServiceCell
                      price={influencer.prices.like}
                      icon={Heart}
                      onClick={() => onServiceSelect(influencer, 'like')}
                      service="like"
                    />
                    <ServiceCell
                      price={influencer.prices.comment}
                      icon={MessageCircle}
                      onClick={() => onServiceSelect(influencer, 'comment')}
                      service="comment"
                    />
                    <ServiceCell
                      price={influencer.prices.repost_story}
                      icon={Share2}
                      onClick={() => onServiceSelect(influencer, 'repost_story')}
                      service="repost_story"
                    />
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInfluencer && (
        <InfluencerProfileModal
          isOpen={!!selectedInfluencer}
          onClose={() => setSelectedInfluencer(null)}
          influencer={selectedInfluencer}
        />
      )}
    </>
  );
}