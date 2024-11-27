import { Instagram, Youtube } from 'lucide-react';
import { TikTok } from '../icons/TikTok';
import { Platform } from '../../lib/types';

interface SocialAccount {
  platform: Platform;
  username: string;
  displayName: string;
  profileImage: string;
  followers: number;
  isVerified: boolean;
  isActive: boolean;
}

interface SocialAccountInfoProps {
  account: SocialAccount;
}

export default function SocialAccountInfo({ account }: SocialAccountInfoProps) {
  const getPlatformIcon = () => {
    switch (account.platform) {
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'tiktok':
        return <TikTok className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className={`flex items-center space-x-4 p-3 rounded-lg ${
      account.isActive ? 'bg-gray-50' : 'bg-gray-100'
    }`}>
      <img
        src={account.profileImage}
        alt={account.displayName}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          {getPlatformIcon()}
          <span className="font-medium text-gray-900">{account.username}</span>
          {account.isVerified && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              Vérifié
            </span>
          )}
          {!account.isActive && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
              Inactif
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {formatFollowers(account.followers)} followers
        </p>
      </div>
    </div>
  );
}