import { UserPlus, Heart, MessageCircle, Share2 } from 'lucide-react';
import { SocialAccount, Service } from '../../../lib/types';
import ServiceCell from './ServiceCell';
import InfluencerCell from './InfluencerCell';
import TableHeader from './TableHeader';

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
  return (
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
              
              <InfluencerCell
                profileImage={influencer.profileImage}
                username={influencer.username}
                displayName={influencer.displayName}
                category={influencer.category}
                isVerified={influencer.isVerified}
                platform={influencer.platform}
              />
              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {influencer.followers.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {influencer.city}, {influencer.country}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {influencer.avgDeliveryTime}h
              </td>

              {multiSelectMode ? (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {influencer.prices.follow?.toFixed(2)} €
                </td>
              ) : (
                <>
                  <ServiceCell
                    price={influencer.prices.follow}
                    icon={UserPlus}
                    onClick={() => onServiceSelect(influencer, 'follow')}
                  />
                  <ServiceCell
                    price={influencer.prices.like}
                    icon={Heart}
                    onClick={() => onServiceSelect(influencer, 'like')}
                  />
                  <ServiceCell
                    price={influencer.prices.comment}
                    icon={MessageCircle}
                    onClick={() => onServiceSelect(influencer, 'comment')}
                  />
                  <ServiceCell
                    price={influencer.prices.repost_story}
                    icon={Share2}
                    onClick={() => onServiceSelect(influencer, 'repost_story')}
                  />
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}