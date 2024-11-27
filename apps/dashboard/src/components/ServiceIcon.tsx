import { UserPlus, Heart, MessageCircle, Share2, Share, Link2 } from 'lucide-react';
import { Service } from '../lib/types';

interface ServiceIconProps {
  service: Service;
  className?: string;
}

export default function ServiceIcon({ service, className = "h-4 w-4" }: ServiceIconProps) {
  switch (service) {
    case 'follow':
      return <UserPlus className={`${className} text-blue-500`} />;
    case 'like':
      return <Heart className={`${className} text-pink-500`} />;
    case 'comment':
      return <MessageCircle className={`${className} text-purple-500`} />;
    case 'repost_story':
      return <Share2 className={`${className} text-green-500`} />;
    case 'repost':
      return <Share className={`${className} text-orange-500`} />;
    case 'connect':
      return <Link2 className={`${className} text-cyan-500`} />;
  }
}