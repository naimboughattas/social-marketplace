import { CreditCard, Building2, Wallet } from 'lucide-react';
import Button from '../Button';

interface PaymentMethod {
  type: 'card' | 'bank' | 'paypal';
  details: {
    cardLast4?: string;
    cardExpiry?: string;
    iban?: string;
    bic?: string;
    accountName?: string;
    paypalEmail?: string;
  };
  isDefault: boolean;
}

interface PaymentMethodInfoProps {
  method: PaymentMethod;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}

export default function PaymentMethodInfo({ 
  method,
  onEdit,
  onDelete,
  onSetDefault
}: PaymentMethodInfoProps) {
  const renderIcon = () => {
    switch (method.type) {
      case 'card':
        return <CreditCard className="h-5 w-5 text-gray-400" />;
      case 'bank':
        return <Building2 className="h-5 w-5 text-gray-400" />;
      case 'paypal':
        return <Wallet className="h-5 w-5 text-gray-400" />;
    }
  };

  const renderDetails = () => {
    switch (method.type) {
      case 'card':
        return (
          <>
            <p className="text-sm text-gray-900">•••• {method.details.cardLast4}</p>
            <p className="text-xs text-gray-500">Expire {method.details.cardExpiry}</p>
          </>
        );
      case 'bank':
        return (
          <>
            <p className="text-sm text-gray-900">IBAN: •••• {method.details.iban?.slice(-4)}</p>
            <p className="text-xs text-gray-500">
              {method.details.accountName} • BIC: {method.details.bic}
            </p>
          </>
        );
      case 'paypal':
        return (
          <p className="text-sm text-gray-900">{method.details.paypalEmail}</p>
        );
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
      {renderIcon()}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">
            {method.type === 'card' ? 'Carte bancaire' :
             method.type === 'bank' ? 'Virement bancaire' : 'PayPal'}
          </h4>
          {method.isDefault && (
            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
              Par défaut
            </span>
          )}
        </div>
        {renderDetails()}
      </div>
      {(onEdit || onDelete || onSetDefault) && (
        <div className="flex items-center space-x-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              Supprimer
            </Button>
          )}
          {onSetDefault && !method.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSetDefault}
            >
              Définir par défaut
            </Button>
          )}
        </div>
      )}
    </div>
  );
}