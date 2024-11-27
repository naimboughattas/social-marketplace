import { Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../lib/auth';

export default function Navbar() {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    return user.role === 'influencer' ? '/dashboard/influencer' : '/dashboard';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Share2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SocialBoost</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/pricing">
              <span className="text-gray-700 hover:text-gray-900">Pricing</span>
            </Link>
            {user?.role === 'business' && (
              <Link to="/dashboard/influencers">
                <span className="text-gray-700 hover:text-gray-900">Influencers</span>
              </Link>
            )}
            {user ? (
              <Link to={getDashboardPath()}>
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}