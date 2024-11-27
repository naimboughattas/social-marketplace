import { Tab } from '@headlessui/react';
import { Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useRankings } from '../../lib/hooks/useRankings';

export default function Rankings() {
  const { globalRankings, countryRankings, cityRankings } = useRankings();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Classement des meilleurs influenceurs</h3>
      
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-purple-100 p-1 mb-4">
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
            Global
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
            Par pays
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
            Par ville
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Global Ranking */}
          <Tab.Panel>
            <div className="space-y-4">
              {globalRankings.map((influencer) => (
                <div
                  key={influencer.username}
                  className={`flex items-center justify-between p-4 ${
                    influencer.rank === 1
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                      : influencer.rank === 2
                      ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                      : influencer.rank === 3
                      ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                      : 'bg-gray-100'
                  } ${
                    influencer.rank <= 3 ? 'text-white' : 'text-gray-900'
                  } rounded-lg`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold">#{influencer.rank}</span>
                    <img
                      src={influencer.avatar}
                      alt={influencer.username}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{influencer.username}</p>
                      <p className="text-sm opacity-90">{influencer.points} points</p>
                    </div>
                  </div>
                  {influencer.rank <= 3 && <Trophy className="h-6 w-6" />}
                </div>
              ))}
            </div>
          </Tab.Panel>

          {/* Country Ranking */}
          <Tab.Panel>
            <div className="space-y-4">
              {Object.entries(countryRankings).map(([country, influencers]) => (
                <div key={country} className="space-y-2">
                  <h4 className="font-medium text-gray-900">{country}</h4>
                  {influencers.map((influencer, index) => (
                    <div
                      key={influencer.username}
                      className={`flex items-center justify-between p-4 ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                          : 'bg-gray-100'
                      } rounded-lg`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold">#{index + 1}</span>
                        <img
                          src={influencer.avatar}
                          alt={influencer.username}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{influencer.username}</p>
                          <p className="text-sm opacity-90">{influencer.points} points</p>
                        </div>
                      </div>
                      {index === 0 && <Trophy className="h-6 w-6" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Tab.Panel>

          {/* City Ranking */}
          <Tab.Panel>
            <div className="space-y-4">
              {Object.entries(cityRankings).map(([city, influencers]) => (
                <div key={city} className="space-y-2">
                  <h4 className="font-medium text-gray-900">{city}</h4>
                  {influencers.map((influencer, index) => (
                    <div
                      key={influencer.username}
                      className={`flex items-center justify-between p-4 ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                          : 'bg-gray-100'
                      } rounded-lg`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold">#{index + 1}</span>
                        <img
                          src={influencer.avatar}
                          alt={influencer.username}
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{influencer.username}</p>
                          <p className="text-sm opacity-90">{influencer.points} points</p>
                        </div>
                      </div>
                      {index === 0 && <Trophy className="h-6 w-6" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}