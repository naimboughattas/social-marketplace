import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

interface InfluencerCellProps {
  profileImage: string;
  username: string;
  displayName: string;
  category: string;
  isVerified: boolean;
  platform: string;
}

export default function InfluencerCell({
  profileImage,
  username,
  displayName,
  category,
  isVerified,
  platform
}: InfluencerCellProps) {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <img
          src={profileImage}
          alt={displayName}
          className="h-10 w-10 rounded-full"
        />
        <div className="ml-4">
          <div className="flex items-center">
            <Link
              to={`/${platform}/${username.replace('@', '')}`}
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              {username}
            </Link>
            {isVerified && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Vérifié
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {category}
          </div>
        </div>
      </div>
    </td>
  );
}