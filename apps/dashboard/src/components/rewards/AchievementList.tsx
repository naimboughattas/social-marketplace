import { Award } from 'lucide-react';
import { Achievement } from '../../lib/gamification';

interface AchievementListProps {
  achievements: Achievement[];
}

export default function AchievementList({ achievements }: AchievementListProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Succès</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 ${
              achievement.completed
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{achievement.title}</h4>
              {achievement.completed && (
                <Award className="h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">{achievement.description}</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>{achievement.progress} / {achievement.target}</span>
                <span className="text-purple-600">+{achievement.reward} points</span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    achievement.completed
                      ? 'bg-green-500'
                      : 'bg-purple-500'
                  }`}
                  style={{
                    width: `${(achievement.progress / achievement.target) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}