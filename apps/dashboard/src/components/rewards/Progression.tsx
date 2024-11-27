import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Trophy, Star, Target, Gift } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Level, Achievement } from '../../lib/gamification';

interface ProgressionProps {
  type: 'buyer' | 'seller';
  currentLevel: Level;
  nextLevels: Level[];
  achievements: Achievement[];
  points: number;
}

export default function Progression({
  type,
  currentLevel,
  nextLevels,
  achievements,
  points
}: ProgressionProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  const unlockedAchievements = achievements.filter(a => a.completed);
  const nextAchievements = achievements
    .filter(a => !a.completed)
    .sort((a, b) => (a.progress / a.target) - (b.progress / b.target))
    .slice(0, 3);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Votre progression</h3>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-purple-100 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              cn(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-purple-700 shadow'
                  : 'text-purple-600 hover:bg-white/[0.12] hover:text-purple-800'
              )
            }
          >
            Prochains niveaux
          </Tab>
          <Tab
            className={({ selected }) =>
              cn(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-purple-700 shadow'
                  : 'text-purple-600 hover:bg-white/[0.12] hover:text-purple-800'
              )
            }
          >
            Challenges à débloquer
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Prochains niveaux */}
          <Tab.Panel>
            <div className="space-y-6">
              {nextLevels.map((level, index) => {
                const pointsNeeded = level.min - points;
                const progress = Math.min(100, (points / level.min) * 100);

                return (
                  <div key={level.name} className="relative">
                    {/* Ligne de connexion */}
                    {index < nextLevels.length - 1 && (
                      <div className="absolute left-7 top-16 bottom-0 w-0.5 bg-gray-200" />
                    )}

                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center`}>
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900">
                            Niveau {level.name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {pointsNeeded.toLocaleString()} points requis
                          </span>
                        </div>

                        <div className="mt-2">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${level.color}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          {level.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <Gift className="h-4 w-4 text-purple-500" />
                              <span className="text-sm text-gray-600">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Tab.Panel>

          {/* Challenges à débloquer */}
          <Tab.Panel>
            <div className="space-y-6">
              {nextAchievements.map((achievement) => {
                const progress = (achievement.progress / achievement.target) * 100;

                return (
                  <div key={achievement.id} className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900">
                            {achievement.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm font-medium text-purple-600">
                              +{achievement.reward} points
                            </span>
                          </div>
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {achievement.description}
                        </p>

                        <div className="mt-2">
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Progression</span>
                            <span>{achievement.progress} / {achievement.target}</span>
                          </div>
                          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                            {Math.round(progress)}% complété
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}