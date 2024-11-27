import { useState } from 'react';
import { Tab } from '@headlessui/react';
import DashboardLayout from '../components/DashboardLayout';
import { useGamification } from '../lib/hooks/useGamification';
import LevelProgress from '../components/rewards/LevelProgress';
import StatsGrid from '../components/rewards/StatsGrid';
import AchievementList from '../components/rewards/AchievementList';
import LevelBenefits from '../components/rewards/LevelBenefits';
import PointsHistory from '../components/rewards/PointsHistory';
import Progression from '../components/rewards/Progression';
import Rankings from '../components/rewards/Rankings';
import { SELLER_LEVELS } from '../lib/gamification';
import { cn } from '../lib/utils';

export default function SellerRewards() {
  const { stats } = useGamification('seller');
  const [selectedTab, setSelectedTab] = useState(0);

  // Get next 3 levels
  const currentLevelIndex = SELLER_LEVELS.findIndex(level => level.name === stats.level.name);
  const nextLevels = SELLER_LEVELS.slice(currentLevelIndex + 1, currentLevelIndex + 4);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Programme de récompenses</h2>
          <p className="mt-1 text-sm text-gray-500">
            Suivez vos points, niveaux et avantages en tant qu'influenceur
          </p>
        </div>

        <LevelProgress
          currentLevel={stats.level}
          nextLevel={stats.nextLevel}
          points={stats.points}
          monthlyPoints={stats.monthlyPoints}
        />

        <StatsGrid
          points={stats.points}
          levelName={stats.level.name}
          monthlyPoints={stats.monthlyPoints}
          totalAmount={stats.totalEarnings}
          type="seller"
        />

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-purple-100 p-1">
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
              Progression
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
              Succès
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
              Avantages
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
              Classements
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
              Historique
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <Progression
                type="seller"
                currentLevel={stats.level}
                nextLevels={nextLevels}
                achievements={stats.achievements}
                points={stats.points}
              />
            </Tab.Panel>

            <Tab.Panel>
              <AchievementList achievements={stats.achievements} />
            </Tab.Panel>

            <Tab.Panel>
              <LevelBenefits benefits={stats.level.benefits} />
            </Tab.Panel>

            <Tab.Panel>
              <Rankings />
            </Tab.Panel>

            <Tab.Panel>
              <PointsHistory history={stats.history} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </DashboardLayout>
  );
}