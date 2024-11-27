import { Trophy, Star, TrendingUp, DollarSign } from 'lucide-react';

interface StatsGridProps {
  points: number;
  levelName: string;
  monthlyPoints: number;
  totalAmount: number;
  type: 'buyer' | 'seller';
}

export default function StatsGrid({
  points = 0,
  levelName = '',
  monthlyPoints = 0,
  totalAmount = 0,
  type
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Points totaux
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {points.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Niveau actuel
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {levelName}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Points ce mois
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {monthlyPoints.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {type === 'buyer' ? 'Total dépensé' : 'Gains totaux'}
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} €
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}