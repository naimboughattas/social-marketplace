import { CheckCircle } from 'lucide-react';
import PlatformIcon from '../PlatformIcon';
import { Platform } from '../../lib/types';

interface InfluencerHeaderProps {
  username: string;
  displayName: string;
  profileImage: string;
  platform: Platform;
  isVerified: boolean;
  category: string;
  city: string;
  country: string;
}

export default function InfluencerHeader({
  username,
  displayName,
  profileImage,
  platform,
  isVerified,
  category,
  city,
  country
}: InfluencerHeaderProps) {
  return (
    <div className="flex items-center space-x-3 mb-4">
      <img
        src={profileImage}
        alt={displayName}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div>
        <div className="flex items-center space-x-2">
          <PlatformIcon platform={platform} className="h-4 w-4" />
          <span className="font-medium">{username}</span>
          {isVerified && <CheckCircle className="h-4 w-4 text-blue-500" />}
        </div>
        <div className="text-sm text-gray-500">
          {category} • {city}, {country}
        </div>
      </div>
    </div>
  );
}