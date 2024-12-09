import { Instagram, Youtube, Facebook, Linkedin } from 'lucide-react';
import { TikTok } from '../icons/TikTok';
import { Twitter } from '../icons/Twitter';
import { Platform } from '../../lib/types';

interface PlatformSelectorProps {
  selectedPlatform: Platform | null;
  onSelect: (platform: Platform) => void;
}

export default function PlatformSelector({
  selectedPlatform,
  onSelect
}: PlatformSelectorProps) {
  const platforms: { id: Platform; label: string; icon: any }[] = [
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'tiktok', label: 'TikTok', icon: TikTok },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'x', label: 'Twitter', icon: Twitter },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {platforms.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-colors ${
            selectedPlatform === id
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
          }`}
        >
          <Icon className={`h-8 w-8 ${
            id === 'instagram' ? 'text-pink-600' :
            id === 'youtube' ? 'text-red-600' :
            id === 'facebook' ? 'text-blue-600' :
            id === 'linkedin' ? 'text-blue-700' :
            'text-gray-900'
          }`} />
          <span className="mt-2 font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}