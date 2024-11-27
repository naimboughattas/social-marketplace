import { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Play } from 'lucide-react';
import { InstagramPost } from '../lib/types';
import { getInstagramPosts } from '../lib/instagram';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PostsModalProps {
  userId: string;
  username: string;
  onClose: () => void;
}

export default function PostsModal({ userId, username, onClose }: PostsModalProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getInstagramPosts(userId);
        setPosts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erreur lors du chargement des publications');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">Publications de @{username}</h3>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-400 hover:text-gray-500" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-5rem)]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              Aucune publication à afficher
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="relative group">
                  <img
                    src={post.thumbnail_url}
                    alt={`Post Instagram ${post.id}`}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300?text=Image+non+disponible';
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex flex-col justify-between p-3">
                    <div className="text-xs text-white">
                      {format(new Date(post.taken_at), 'dd MMM yyyy', { locale: fr })}
                    </div>
                    
                    <div className="flex justify-around text-white text-sm">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes_count.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comment_count.toLocaleString()}
                      </div>
                      {post.play_count > 0 && (
                        <div className="flex items-center">
                          <Play className="h-4 w-4 mr-1" />
                          {post.play_count.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}