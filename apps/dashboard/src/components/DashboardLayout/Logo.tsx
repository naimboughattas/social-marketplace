import { Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';

interface LogoProps {
  isSidebarCollapsed: boolean;
}

export default function Logo({ isSidebarCollapsed }: LogoProps) {
  return (
    <div className="h-16 flex items-center justify-center px-4 border-b">
      <Link to="/" className="flex items-center space-x-2">
        <Share2 className="h-8 w-8 text-purple-600" />
        {!isSidebarCollapsed && (
          <span className="text-xl font-bold">SocialBoost</span>
        )}
      </Link>
    </div>
  );
}