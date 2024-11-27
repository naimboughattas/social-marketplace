import { Grid, Link as LinkIcon } from 'lucide-react';
import Input from '../Input';

interface PostSelectionProps {
  showPostSelection: boolean;
  selectedPosts: string[];
  postUrl: string;
  onShowPostSelectionChange: (show: boolean) => void;
  onSelectedPostsChange: (posts: string[]) => void;
  onPostUrlChange: (url: string) => void;
}

// Mock data for posts
const MOCK_POSTS = [
  { id: '1', url: 'https://instagram.com/p/123', thumbnail: 'https://picsum.photos/300/300?random=1' },
  { id: '2', url: 'https://instagram.com/p/456', thumbnail: 'https://picsum.photos/300/300?random=2' },
  { id: '3', url: 'https://instagram.com/p/789', thumbnail: 'https://picsum.photos/300/300?random=3' },
  { id: '4', url: 'https://instagram.com/p/012', thumbnail: 'https://picsum.photos/300/300?random=4' },
];

export default function PostSelection({
  showPostSelection,
  selectedPosts,
  postUrl,
  onShowPostSelectionChange,
  onSelectedPostsChange,
  onPostUrlChange
}: PostSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <button
          onClick={() => onShowPostSelectionChange(true)}
          className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
            showPostSelection ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
          }`}
        >
          <Grid className="h-5 w-5 mx-auto mb-2" />
          <span className="block text-center">Sélectionner des posts</span>
        </button>
        <button
          onClick={() => onShowPostSelectionChange(false)}
          className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
            !showPostSelection ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
          }`}
        >
          <LinkIcon className="h-5 w-5 mx-auto mb-2" />
          <span className="block text-center">Ajouter via URL</span>
        </button>
      </div>

      {showPostSelection ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                if (selectedPosts.includes(post.url)) {
                  onSelectedPostsChange(selectedPosts.filter(p => p !== post.url));
                } else {
                  onSelectedPostsChange([...selectedPosts, post.url]);
                }
              }}
              className={`relative cursor-pointer rounded-lg overflow-hidden group ${
                selectedPosts.includes(post.url) ? 'ring-2 ring-purple-600' : ''
              }`}
            >
              <img
                src={post.thumbnail}
                alt="Post"
                className="w-full h-32 object-cover"
              />
              <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${
                selectedPosts.includes(post.url) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  selectedPosts.includes(post.url)
                    ? 'border-white bg-purple-600'
                    : 'border-white'
                }`}>
                  {selectedPosts.includes(post.url) && (
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Input
          label="URL du post"
          value={postUrl}
          onChange={(e) => onPostUrlChange(e.target.value)}
          placeholder="https://instagram.com/p/..."
          required
        />
      )}
    </div>
  );
}