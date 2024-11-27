import { Service } from '../../lib/types';
import ServiceButton from './ServiceButton';

interface ServiceListProps {
  services: Service[];
  prices: Record<Service, number>;
  onServiceSelect: (service: Service) => void;
}

export default function ServiceList({
  services,
  prices,
  onServiceSelect
}: ServiceListProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {services.map((service) => (
        prices[service] && (
          <ServiceButton
            key={service}
            service={service}
            price={prices[service]}
            onClick={() => onServiceSelect(service)}
          />
        )
      ))}
    </div>
  );
}