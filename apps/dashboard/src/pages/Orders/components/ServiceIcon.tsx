import { UserPlus, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Service } from '../types';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ServiceIconProps {
  service: Service;
}

export default function ServiceIcon({ service }: ServiceIconProps) {
  const Icon = {
    follow: UserPlus,
    like: Heart,
    comment: MessageCircle,
    repost_story: Share2
  }[service];

  const label = {
    follow: 'Follow',
    like: 'Like',
    comment: 'Comment',
    repost_story: 'Repost Story'
  }[service];

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className="flex items-center">
            <Icon className="h-4 w-4" />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-900 text-white px-2 py-1 rounded text-sm"
            sideOffset={5}
          >
            {label}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}