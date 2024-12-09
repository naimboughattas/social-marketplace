import { Service } from '../../lib/types';

interface ServiceStepProps {
  selectedService: Service;
  onServiceSelect: (service: Service) => void;
}

export default function ServiceStep({
  selectedService,
  onServiceSelect
}: ServiceStepProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Choisissez un service</h3>
      <div className="grid grid-cols-2 gap-4">
        {(['follow', 'like', 'comment', 'repost_story'] as Service[]).map((service) => (
          <button
            key={service}
            onClick={() => onServiceSelect(service)}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedService === service
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-200'
            }`}
          >
            <div className="font-medium capitalize">{service}</div>
            <p className="text-sm text-gray-500 mt-1">
              {service === 'follow' ? 'Suivre un compte' :
               service === 'like' ? 'Liker des posts' :
               service === 'comment' ? 'Commenter des posts' :
               'Partager en story'}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}