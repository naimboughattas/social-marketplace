import { UserPlus, Heart, MessageCircle, Share2 } from 'lucide-react';
import Button from '../Button';
import { SocialAccount, Service } from '../../lib/types';
import SortableHeader from './SortableHeader';

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
        <thead className="bg-gray-50">
          <tr>
            {multiSelectMode && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sélection
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Influenceur
            </th>
            <SortableHeader field="followers" label="Followers" currentField={sortField} direction={sortDirection} onSort={onSort} />
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Localisation
            </th>
            <SortableHeader field="delai" label="Délai" currentField={sortField} direction={sortDirection} onSort={onSort} />
            {!multiSelectMode ? (
              <>
                <SortableHeader field="follow" label="Follow" currentField={sortField} direction={sortDirection} onSort={onSort} />
                <SortableHeader field="like" label="Like" currentField={sortField} direction={sortDirection} onSort={onSort} />
                <SortableHeader field="comment" label="Comment" currentField={sortField} direction={sortDirection} onSort={onSort} />
                <SortableHeader field="repost" label="Repost" currentField={sortField} direction={sortDirection} onSort={onSort} />
              </>
            ) : (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
            )}
          </tr>
        </thead>
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
                <div className="flex items-center">
                  <img
                    src={influencer.profileImage}
                    alt={influencer.displayName}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="ml-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {influencer.username}
                      </div>
                      {influencer.isVerified && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Vérifié
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {influencer.category}
                    </div>
                  </div>
                </div>
              </td>
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

interface ServiceCellProps {
  price?: number;
  icon: any;
  onClick: () => void;
}

function ServiceCell({ price, icon: Icon, onClick }: ServiceCellProps) {
  if (!price) return <td className="px-6 py-4 whitespace-nowrap" />;
  
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <Button
        size="sm"
        variant="outline"
        onClick={onClick}
        className="flex items-center space-x-2"
      >
        <Icon className="h-4 w-4" />
        <span>{price.toFixed(2)} €</span>
      </Button>
    </td>
  );
}