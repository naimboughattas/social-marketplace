import { Search } from 'lucide-react';
import { Platform } from '../../lib/types';
import PlatformIcon from '../PlatformIcon';
import Input from '../Input';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onPlatformSelect: (platform: Platform) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function PlatformSelector({
  selectedPlatform,
  onPlatformSelect,
  search,
  onSearchChange
}: PlatformSelectorProps) {
  const platforms: Platform[] = ['instagram', 'tiktok', 'youtube', 'x', 'facebook', 'linkedin'];

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex space-x-2">
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => onPlatformSelect(platform)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              selectedPlatform === platform
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PlatformIcon platform={platform} />
            <span className="capitalize">{platform}</span>
          </button>
        ))}
      </div>
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un influenceur..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
}