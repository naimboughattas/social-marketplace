import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Title, TextInput, TabGroup, Tab, TabList, TabPanel, TabPanels } from '@tremor/react';
import { Search, CheckCircle, Clock, Star } from 'lucide-react';
import PlatformIcon from '../../components/PlatformIcon';
import ServiceIcon from '../../components/ServiceIcon';
import Button from '../../components/Button';
import { Platform, Service } from '../../lib/types';
import { useNotifications } from '../../lib/notifications';

interface Influencer {
  id: string;
  platform: Platform;
  username: string;
  displayName: string;
  profileImage: string;
  followers: number;
  category: string;
  country: string;
  city: string;
  language: string;
  isVerified: boolean;
  isActive: boolean;
  services: {
    service: Service;
    price: number;
    isActive: boolean;
  }[];
  completedOrders: number;
  rating: number;
}

// Mock data for influencers
const mockInfluencers: Influencer[] = [
  {
    id: '1',
    platform: 'instagram',
    username: '@fashion_style',
    displayName: 'Fashion Style',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
    followers: 345000,
    category: 'Fashion',
    country: 'France',
    city: 'Paris',
    language: 'French',
    isVerified: true,
    isActive: true,
    services: [
      { service: 'follow', price: 4, isActive: true },
      { service: 'like', price: 2, isActive: true },
      { service: 'comment', price: 8, isActive: true }
    ],
    completedOrders: 1245,
    rating: 4.9
  },
  {
    id: '2',
    platform: 'tiktok',
    username: '@dance_queen',
    displayName: 'Dance Queen',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    followers: 890000,
    category: 'Dance',
    country: 'France',
    city: 'Lyon',
    language: 'French',
    isVerified: true,
    isActive: true,
    services: [
      { service: 'follow', price: 5, isActive: true },
      { service: 'like', price: 3, isActive: true }
    ],
    completedOrders: 856,
    rating: 4.8
  },
  {
    id: '3',
    platform: 'x',
    username: '@tech_guru',
    displayName: 'Tech Guru',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    followers: 156000,
    category: 'Technology',
    country: 'France',
    city: 'Toulouse',
    language: 'French',
    isVerified: true,
    isActive: true,
    services: [
      { service: 'follow', price: 3, isActive: true },
      { service: 'like', price: 1, isActive: true },
      { service: 'repost', price: 5, isActive: true }
    ],
    completedOrders: 423,
    rating: 4.7
  },
  {
    id: '4',
    platform: 'facebook',
    username: '@lifestyle_tips',
    displayName: 'Lifestyle Tips',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop',
    followers: 78000,
    category: 'Lifestyle',
    country: 'France',
    city: 'Bordeaux',
    language: 'French',
    isVerified: true,
    isActive: true,
    services: [
      { service: 'follow', price: 2, isActive: true },
      { service: 'like', price: 1, isActive: true },
      { service: 'comment', price: 4, isActive: true }
    ],
    completedOrders: 245,
    rating: 4.6
  },
  {
    id: '5',
    platform: 'linkedin',
    username: '@business_coach',
    displayName: 'Business Coach',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
    followers: 45000,
    category: 'Business',
    country: 'France',
    city: 'Paris',
    language: 'French',
    isVerified: true,
    isActive: true,
    services: [
      { service: 'connect', price: 5, isActive: true },
      { service: 'like', price: 2, isActive: true },
      { service: 'comment', price: 6, isActive: true }
    ],
    completedOrders: 189,
    rating: 4.9
  }
];

// Mock data for pending verifications
const mockPendingVerifications = [
  {
    id: '1',
    platform: 'instagram' as Platform,
    username: '@new_influencer',
    displayName: 'New Influencer',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop',
    verificationCode: 'VERIFY-123456',
    codeSent: true,
    createdAt: new Date()
  },
  {
    id: '2',
    platform: 'tiktok' as Platform,
    username: '@tiktok_star',
    displayName: 'TikTok Star',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    verificationCode: 'VERIFY-789012',
    codeSent: false,
    createdAt: new Date()
  }
];

export default function AdminInfluencers() {
  const { addNotification } = useNotifications();
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState<Platform | 'all'>('all');
  const [influencers] = useState(mockInfluencers);
  const [pendingVerifications] = useState(mockPendingVerifications);

  const handleVerify = async (id: string, code: string) => {
    try {
      // API call to verify the account
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        message: 'Compte vérifié avec succès'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de la vérification'
      });
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const filteredInfluencers = influencers.filter(influencer => {
    if (platform !== 'all' && influencer.platform !== platform) return false;
    if (search && !influencer.username.toLowerCase().includes(search.toLowerCase()) &&
        !influencer.displayName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <Title>Gestion des influenceurs</Title>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les influenceurs et les demandes de vérification
          </p>
        </div>

        <TabGroup>
          <TabList>
            <Tab>Influenceurs</Tab>
            <Tab>Vérifications en attente ({pendingVerifications.length})</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Card>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <TextInput
                      icon={Search}
                      placeholder="Rechercher un influenceur..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as Platform | 'all')}
                      className="rounded-md border-gray-200 text-gray-900"
                    >
                      <option value="all">Toutes les plateformes</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="x">X</option>
                      <option value="facebook">Facebook</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {filteredInfluencers.map((influencer) => (
                      <Link
                        key={influencer.id}
                        to={`/admin/customers/${influencer.id}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                          <div className="flex items-center space-x-4">
                            <img
                              src={influencer.profileImage}
                              alt={influencer.displayName}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <PlatformIcon platform={influencer.platform} />
                                <span className="font-medium">{influencer.username}</span>
                                {influencer.isVerified && (
                                  <CheckCircle className="h-4 w-4 text-blue-500" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center space-x-2">
                                <span>{formatFollowers(influencer.followers)} followers</span>
                                <span>•</span>
                                <span className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  {influencer.rating}
                                </span>
                                <span>•</span>
                                <span>{influencer.completedOrders} commandes</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                {influencer.services.map((service) => (
                                  <div
                                    key={service.service}
                                    className="flex items-center space-x-1 text-xs bg-white px-2 py-1 rounded border"
                                  >
                                    <ServiceIcon service={service.service} />
                                    <span>{service.price}€</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {influencer.city}, {influencer.country}
                          </div>
                        </div>
                      </Link>
                    ))}

                    {filteredInfluencers.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        Aucun influenceur trouvé
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </TabPanel>

            <TabPanel>
              <Card>
                <div className="space-y-4">
                  {pendingVerifications.map((verification) => (
                    <div
                      key={verification.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={verification.profileImage}
                          alt={verification.displayName}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <PlatformIcon platform={verification.platform} />
                            <span className="font-medium">{verification.username}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {verification.codeSent ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Code envoyé
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                En attente d'envoi
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {verification.codeSent && (
                        <Button
                          variant="outline"
                          onClick={() => handleVerify(verification.id, verification.verificationCode)}
                        >
                          Vérifier le code
                        </Button>
                      )}
                    </div>
                  ))}

                  {pendingVerifications.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      Aucune vérification en attente
                    </div>
                  )}
                </div>
              </Card>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </AdminLayout>
  );
}