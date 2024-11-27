import { Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';
import { TikTok } from './icons/TikTok';
import { Twitter } from './icons/Twitter';
import { Platform } from '../lib/types';

interface PlatformIconProps {
  platform: Platform;
  className?: string;
  showLabel?: boolean;
}

export default function PlatformIcon({ platform, className = "h-5 w-5", showLabel = false }: PlatformIconProps) {
  const getIcon = () => {
    switch (platform) {
      case 'instagram':
        return <Instagram className={`${className} text-[#E4405F]`} />;
      case 'tiktok':
        return <TikTok className={className} />;
      case 'youtube':
        return <Youtube className={`${className} text-[#FF0000]`} />;
      case 'x':
        return <Twitter className={className} />;
      case 'facebook':
        return <Facebook className={`${className} text-[#1877F2]`} />;
      case 'linkedin':
        return <Linkedin className={`${className} text-[#0A66C2]`} />;
    }
  };

  const getLabel = () => {
    switch (platform) {
      case 'instagram':
        return 'Instagram';
      case 'tiktok':
        return 'TikTok';
      case 'youtube':
        return 'YouTube';
      case 'x':
        return 'X';
      case 'facebook':
        return 'Facebook';
      case 'linkedin':
        return 'LinkedIn';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {getIcon()}
      {showLabel && <span>{getLabel()}</span>}
    </div>
  );
}