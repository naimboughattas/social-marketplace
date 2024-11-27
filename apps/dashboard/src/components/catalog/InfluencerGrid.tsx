import { SocialAccount, Service } from '../../lib/types';
import InfluencerCard from './InfluencerCard';

interface InfluencerGridProps {
  influencers: SocialAccount[];
  onServiceSelect: (influencer: SocialAccount, service: Service) => void;
}

export default function InfluencerGrid({
  influencers,
  onServiceSelect
}: InfluencerGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {influencers.map((influencer) => (
        <InfluencerCard
          key={influencer.id}
          influencer={influencer}
          onServiceSelect={(service) => onServiceSelect(influencer, service)}
        />
      ))}
    </div>
  );
}