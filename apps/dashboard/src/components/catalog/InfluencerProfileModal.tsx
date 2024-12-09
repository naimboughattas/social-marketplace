import { useState } from 'react';
import { X, Star, Clock, Calendar, ExternalLink } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SocialAccount } from '../../lib/types';
import PlatformIcon from '../PlatformIcon';

interface InfluencerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  influencer: SocialAccount;
}

// Mock data for posts/videos
const MOCK_POSTS = [
  {
    id: '1',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=300&fit=crop',
    likes: 1200,
    comments: 45,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=300&h=300&fit=crop',
    likes: 2300,
    comments: 78,
    views: 15000,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    likes: 980,
    comments: 32,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  }
];

export default function InfluencerProfileModal({
  isOpen,
  onClose,
  influencer
}: InfluencerProfileModalProps) {
  const [selectedTab, setSelectedTab] = useState<'posts' | 'history'>('posts');

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-[5%] left-1/2 -translate-x-1/2 bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <img
                  src={influencer.profileImage}
                  alt={influencer.displayName}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <PlatformIcon platform={influencer.platform} className="h-5 w-5" />
                    <Dialog.Title className="text-xl font-bold">
                      {influencer.username}
                    </Dialog.Title>
                  </div>
                  <p className="text-gray-600 mt-1">{influencer.displayName}</p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button onClick={onClose}>
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </Dialog.Close>
            </div>

            {/* Basic Stats */}
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(influencer.followers)}
                </div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900">
                    {influencer.rating}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {influencer.completedOrders} avis
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">
                    {influencer.avgDeliveryTime}h
                  </span>
                </div>
                <div className="text-sm text-gray-500">Délai moyen</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">
                    6
                  </span>
                </div>
                <div className="text-sm text-gray-500">Mois d'ancienneté</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Catégories
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {influencer.category}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Langues
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {influencer.language}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 400px)' }}>
            <div className="grid grid-cols-3 gap-4">
              {MOCK_POSTS.map((post) => (
                <div key={post.id} className="relative group">
                  <img
                    src={post.thumbnail}
                    alt=""
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex flex-col justify-between p-4">
                    <div className="text-white text-sm">
                      {format(post.date, 'dd MMM yyyy', { locale: fr })}
                    </div>
                    <div className="flex justify-around text-white text-sm">
                      <span>❤️ {formatNumber(post.likes)}</span>
                      <span>💬 {formatNumber(post.comments)}</span>
                      {'views' in post && (
                        <span>👁️ {formatNumber(post.views)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}