import { UserPlus, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Service } from '../lib/types';

interface ServiceMenuProps {
  selectedService: Service | null;
  onServiceSelect: (service: Service | null) => void;
}

export default function ServiceMenu({ selectedService, onServiceSelect }: ServiceMenuProps) {
  const services: { id: Service; label: string; icon: typeof UserPlus }[] = [
    { id: 'follow', label: 'Follow', icon: UserPlus },
    { id: 'like', label: 'Like', icon: Heart },
    { id: 'comment', label: 'Comment', icon: MessageCircle },
    { id: 'repost_story', label: 'Repost', icon: Share2 },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onServiceSelect(null)}
          className={`${
            !selectedService
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
        >
          Tous les services
        </button>
        
        {services.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onServiceSelect(id)}
            className={`${
              selectedService === id
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}