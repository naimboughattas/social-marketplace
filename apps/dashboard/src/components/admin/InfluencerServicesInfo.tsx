import { UserPlus, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Service } from '../../lib/types';
import EditablePrice from './EditablePrice';
import EditableToggle from './EditableToggle';

interface InfluencerService {
  service: Service;
  price: number;
  isActive: boolean;
}

interface InfluencerServicesInfoProps {
  services: InfluencerService[];
  onUpdateService: (service: Service, updates: Partial<InfluencerService>) => void;
}

export default function InfluencerServicesInfo({ services, onUpdateService }: InfluencerServicesInfoProps) {
  const getServiceIcon = (service: Service) => {
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

  const getServiceLabel = (service: Service) => {
    switch (service) {
      case 'follow':
        return 'Follow';
      case 'like':
        return 'Like';
      case 'comment':
        return 'Comment';
      case 'repost_story':
        return 'Repost Story';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {services.map((service) => (
        <div
          key={service.service}
          className={`flex items-center justify-between p-3 rounded-lg ${
            service.isActive ? 'bg-gray-50' : 'bg-gray-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            {getServiceIcon(service.service)}
            <span className="text-sm font-medium text-gray-900">
              {getServiceLabel(service.service)}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <EditablePrice
              value={service.price}
              onSave={(price) => onUpdateService(service.service, { price })}
            />
            <EditableToggle
              value={service.isActive}
              label="Actif"
              onToggle={(isActive) => onUpdateService(service.service, { isActive })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}