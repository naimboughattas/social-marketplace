import { Star } from 'lucide-react';

interface InfluencerStatsProps {
  followers: number;
  rating: number;
  completedOrders: number;
  avgDeliveryTime: number;
}

export default function InfluencerStats({
  followers,
  rating,
  completedOrders,
  avgDeliveryTime
}: InfluencerStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
      <div className="bg-gray-50 rounded-lg p-2">
        <div className="font-medium">{formatNumber(followers)}</div>
        <div className="text-gray-500 text-xs">Followers</div>
      </div>
      <div className="bg-gray-50 rounded-lg p-2">
        <div className="flex items-center justify-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="font-medium">{rating}</span>
        </div>
        <div className="text-gray-500 text-xs">{completedOrders} avis</div>
      </div>
      <div className="bg-gray-50 rounded-lg p-2">
        <div className="font-medium">{avgDeliveryTime}h</div>
        <div className="text-gray-500 text-xs">Délai moyen</div>
      </div>
    </div>
  );
}