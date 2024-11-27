import { Building2, Wallet } from 'lucide-react';
import Button from '../../../components/Button';
import { WithdrawMethod } from '../types';

interface WithdrawMethodCardProps {
  method: WithdrawMethod;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export default function WithdrawMethodCard({
  method,
  onDelete,
  onSetDefault
}: WithdrawMethodCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {method.type === 'bank' && <Building2 className="h-5 w-5 text-gray-400" />}
          {method.type === 'paypal' && <Wallet className="h-5 w-5 text-gray-400" />}
          <div>
            <div className="font-medium">{method.name}</div>
            <div className="text-sm text-gray-500">
              {method.type === 'bank' && `IBAN: •••• ${method.details.iban?.slice(-4)}`}
              {method.type === 'paypal' && method.details.paypalEmail}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!method.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(method.id)}
            >
              Définir par défaut
            </Button>
          )}
          {method.isDefault && (
            <span className="text-sm text-purple-600 font-medium">
              Par défaut
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(method.id)}
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}