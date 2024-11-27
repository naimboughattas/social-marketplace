import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

export default function BalanceInfo() {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-gray-600">
        <span>Solde: </span>
        <Link 
          to="/dashboard/topup"
          className="font-medium hover:text-purple-600 transition-colors"
        >
          {user?.balance?.toFixed(2)} €
        </Link>
      </div>

      {user?.pendingBalance !== undefined && (
        <>
          <span className="text-gray-300">|</span>
          <div className="text-sm text-gray-600">
            <span>Gains: </span>
            <Link 
              to="/dashboard/withdraw"
              className="font-medium hover:text-purple-600 transition-colors"
            >
              {user?.pendingBalance?.toFixed(2)} €
            </Link>
          </div>
        </>
      )}
    </div>
  );
}