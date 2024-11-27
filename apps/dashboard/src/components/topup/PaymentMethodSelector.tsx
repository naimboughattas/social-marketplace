import { CreditCard, Building2, Wallet } from 'lucide-react';
import Button from '../Button';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  details: {
    cardLast4?: string;
    cardExpiry?: string;
    iban?: string;
    email?: string;
  };
  isDefault: boolean;
}

interface PaymentMethodSelectorProps {
  selectedMethodId: string | null;
  onMethodSelect: (methodId: string) => void;
  onAddMethod: () => void;
}

export default function PaymentMethodSelector({
  selectedMethodId,
  onMethodSelect,
  onAddMethod
}: PaymentMethodSelectorProps) {
  // Récupérer les méthodes depuis le localStorage
  const methods: PaymentMethod[] = JSON.parse(localStorage.getItem('payment_methods') || '[]');

  if (methods.length === 0) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Aucun moyen de paiement
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Ajoutez un moyen de paiement pour continuer
        </p>
        <Button
          className="mt-4"
          onClick={onAddMethod}
        >
          Ajouter un moyen de paiement
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
            {method.type === 'card' && <CreditCard className="h-5 w-5 text-gray-400" />}
            {method.type === 'bank' && <Building2 className="h-5 w-5 text-gray-400" />}
            {method.type === 'paypal' && <Wallet className="h-5 w-5 text-gray-400" />}
            <div>
              <div className="font-medium">
                {method.type === 'card' ? 'Carte bancaire' :
                 method.type === 'bank' ? 'Virement bancaire' : 'PayPal'}
              </div>
              <div className="text-sm text-gray-500">
                {method.type === 'card' && `•••• ${method.details.cardLast4}`}
                {method.type === 'paypal' && method.details.email}
                {method.type === 'bank' && `IBAN: •••• ${method.details.iban?.slice(-4)}`}
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