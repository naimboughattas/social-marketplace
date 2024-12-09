import { CheckCircle } from 'lucide-react';
import { Platform } from '../../../lib/types';

interface InfluencerCellProps {
  profileImage: string;
  username: string;
  displayName: string;
  category: string;
  isVerified: boolean;
  platform: Platform;
  onProfileClick: () => void;
}

export default function InfluencerCell({
  profileImage,
  username,
  displayName,
  category,
  isVerified,
  platform,
  onProfileClick
}: InfluencerCellProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex items-center space-x-3 group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProfileClick();
            }}
            className="flex items-center space-x-3 hover:text-purple-600 focus:outline-none"
          >
            <img
              src={profileImage}
              alt={displayName}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center">
                <span className="font-medium group-hover:text-purple-600">{username}</span>
                {isVerified && (
                  <CheckCircle className="ml-2 h-4 w-4 text-blue-500" />
                )}
              </div>
              <div className="text-sm text-gray-500">
                {category}
              </div>
            </div>
          </button>
        </div>
      </div>
    </td>
  );
}