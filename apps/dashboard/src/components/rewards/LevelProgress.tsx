import { Trophy } from 'lucide-react';
import { Level } from '../../lib/gamification';

interface LevelProgressProps {
  currentLevel: Level;
  nextLevel: Level | null;
  points: number;
  monthlyPoints: number;
}

export default function LevelProgress({
  currentLevel,
  nextLevel,
  points,
  monthlyPoints
}: LevelProgressProps) {
  const pointsToNextLevel = nextLevel ? nextLevel.min - points : 0;
  const progress = nextLevel 
    ? ((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`h-16 w-16 rounded-full bg-gradient-to-r ${currentLevel.color} flex items-center justify-center`}>
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Niveau {currentLevel.name}
            </h3>
            <p className="text-sm text-gray-500">
              {pointsToNextLevel > 0 
                ? `${pointsToNextLevel} points pour atteindre le niveau ${nextLevel?.name}`
                : 'Niveau maximum atteint !'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">
            {points} points
          </div>
          <p className="text-sm text-gray-500">
            {monthlyPoints} points ce mois-ci
          </p>
        </div>
      </div>

      {nextLevel && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}