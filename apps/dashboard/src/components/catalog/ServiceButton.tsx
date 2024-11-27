import { UserPlus, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Service } from '../../lib/types';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ServiceButtonProps {
  service: Service;
  price: number;
  onClick: () => void;
}

export default function ServiceButton({
  service,
  price,
  onClick
}: ServiceButtonProps) {
  const getIcon = () => {
    switch (service) {
      case 'follow':
        return <UserPlus className="h-4 w-4" />;
      case 'like':
        return <Heart className="h-4 w-4" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4" />;
      case 'repost_story':
        return <Share2 className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (service) {
      case 'follow':
        return 'Follow';
      case 'like':
        return 'Like';
      case 'comment':
        return 'Comment';
      case 'repost_story':
        return 'Repost';
    }
  };

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={onClick}
            className="inline-flex items-center justify-center space-x-2 px-3 py-1.5 text-sm
                     bg-white border border-gray-300 hover:border-gray-400 
                     rounded-lg transition-colors"
          >
            <span className="text-gray-600">{getIcon()}</span>
            <span className="text-gray-700">{price.toFixed(2)} €</span>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
            sideOffset={5}
          >
            Commander un {getLabel()}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}