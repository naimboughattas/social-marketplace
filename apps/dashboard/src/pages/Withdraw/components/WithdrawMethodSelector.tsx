import { Building2, Wallet } from 'lucide-react';
import Button from '../../../components/Button';
import { WithdrawMethod } from '../types';

interface WithdrawMethodSelectorProps {
  selectedMethodId: string | null;
  onMethodSelect: (methodId: string) => void;
  onAddMethod: () => void;
}

export default function WithdrawMethodSelector({
  selectedMethodId,
  onMethodSelect,
  onAddMethod
}: WithdrawMethodSelectorProps) {
  const methods: WithdrawMethod[] = JSON.parse(localStorage.getItem('withdraw_methods') || '[]');

  if (methods.length === 0) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <Wallet className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Aucune méthode de retrait
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Ajoutez une méthode de retrait pour continuer
        </p>
        <Button
          className="mt-4"
          onClick={onAddMethod}
        >
          Ajouter une méthode
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <button
          key={method.id}
          className={`flex items-center justify-between p-4 border rounded-lg w-full ${
            selectedMethodId === method.id
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => onMethodSelect(method.id)}
        >
          <div className="flex items-center space-x-3">
            {method.type === 'bank' && <Building2 className="h-5 w-5 text-gray-400" />}
            {method.type === 'paypal' && <Wallet className="h-5 w-5 text-gray-400" />}
            <div>
              <div className="font-medium">
                {method.type === 'bank' ? 'Virement bancaire' : 'PayPal'}
              </div>
              <div className="text-sm text-gray-500">
                {method.type === 'bank' && `IBAN: •••• ${method.details.iban?.slice(-4)}`}
                {method.type === 'paypal' && method.details.paypalEmail}
              </div>
            </div>
          </div>
          {method.isDefault && (
            <span className="text-sm text-purple-600 font-medium">
              Par défaut
            </span>
          )}
        </button>
      ))}
    </div>
  );
}