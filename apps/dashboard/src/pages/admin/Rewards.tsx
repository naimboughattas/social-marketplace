import { useState } from 'react';
import { Tab } from '@headlessui/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, TextInput, Select, SelectItem } from '@tremor/react';
import { Search, Trophy, Star, Target, Gift } from 'lucide-react';
import Button from '../../components/Button';
import { cn } from '../../lib/utils';
import { BUYER_LEVELS, SELLER_LEVELS } from '../../lib/gamification';

interface Level {
  name: string;
  min: number;
  max: number | null;
  color: string;
  benefits: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  target: number;
  reward: number;
  type: 'buyer' | 'seller';
  enabled: boolean;
}

export default function AdminRewards() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [buyerLevels, setBuyerLevels] = useState(BUYER_LEVELS);
  const [sellerLevels, setSellerLevels] = useState(SELLER_LEVELS);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);

  const handleSaveLevel = (level: Level) => {
    // Save level logic here
    setEditingLevel(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Title>Gestion des récompenses</Title>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les niveaux, succès et récompenses des utilisateurs
          </p>
        </div>

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
              Niveaux Acheteurs
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
              Niveaux Vendeurs
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
              Récompenses
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-4">
            {/* Niveaux Acheteurs */}
            <Tab.Panel>
              <Card>
                <div className="space-y-6">
                  {buyerLevels.map((level, index) => (
                    <div
                      key={level.name}
                      className="relative p-6 border rounded-lg"
                    >
                      {/* Ligne de connexion */}
                      {index < buyerLevels.length - 1 && (
                        <div className="absolute left-10 top-24 bottom-0 w-0.5 bg-gray-200" />
                      )}

                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center`}>
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              Niveau {level.name}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingLevel(level)}
                            >
                              Modifier
                            </Button>
                          </div>

                          <div className="mt-2 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Points requis</p>
                              <p className="font-medium">{level.min.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Points maximum</p>
                              <p className="font-medium">
                                {level.max ? level.max.toLocaleString() : '∞'}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500 mb-2">Avantages</p>
                            <div className="space-y-2">
                              {level.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <Gift className="h-4 w-4 text-purple-500" />
                                  <span className="text-sm">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Tab.Panel>

            {/* Niveaux Vendeurs */}
            <Tab.Panel>
              <Card>
                <div className="space-y-6">
                  {sellerLevels.map((level, index) => (
                    <div
                      key={level.name}
                      className="relative p-6 border rounded-lg"
                    >
                      {/* Ligne de connexion */}
                      {index < sellerLevels.length - 1 && (
                        <div className="absolute left-10 top-24 bottom-0 w-0.5 bg-gray-200" />
                      )}

                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center`}>
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              Niveau {level.name}
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingLevel(level)}
                            >
                              Modifier
                            </Button>
                          </div>

                          <div className="mt-2 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Points requis</p>
                              <p className="font-medium">{level.min.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Points maximum</p>
                              <p className="font-medium">
                                {level.max ? level.max.toLocaleString() : '∞'}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500 mb-2">Avantages</p>
                            <div className="space-y-2">
                              {level.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <Gift className="h-4 w-4 text-purple-500" />
                                  <span className="text-sm">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Tab.Panel>

            {/* Succès */}
            <Tab.Panel>
              <Card>
                <div className="space-y-6">
                  {/* Implémentez la gestion des succès ici */}
                </div>
              </Card>
            </Tab.Panel>

            {/* Récompenses */}
            <Tab.Panel>
              <Card>
                <div className="space-y-6">
                  {/* Implémentez la gestion des récompenses ici */}
                </div>
              </Card>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Modal d'édition de niveau */}
        {editingLevel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Modifier le niveau {editingLevel.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Points minimum
                  </label>
                  <TextInput
                    type="number"
                    value={editingLevel.min}
                    onChange={() => {}}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Points maximum
                  </label>
                  <TextInput
                    type="number"
                    value={editingLevel.max || ''}
                    onChange={() => {}}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Avantages
                  </label>
                  <div className="space-y-2">
                    {editingLevel.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <TextInput
                          value={benefit}
                          onChange={() => {}}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {}}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {}}
                    >
                      Ajouter un avantage
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setEditingLevel(null)}
                  >
                    Annuler
                  </Button>
                  <Button onClick={() => handleSaveLevel(editingLevel)}>
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}