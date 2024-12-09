import { Menu } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import LanguageSelector from '../LanguageSelector';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-4 text-lg font-semibold">Administration</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {user?.email}
          </div>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}