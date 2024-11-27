import { useState } from 'react';
import { CreditCard, Building2, Wallet } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import { useNotifications } from '../../lib/notifications';
import { VisaIcon, MastercardIcon, PayPalIcon, BankTransferIcon } from '../icons/PaymentIcons';

interface PaymentMethodFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function PaymentMethodForm({ onSave, onCancel }: PaymentMethodFormProps) {
  const { addNotification } = useNotifications();
  const [type, setType] = useState<'card' | 'bank' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [accountName, setAccountName] = useState('');

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{0,2})/, '$1/$2')
      .substr(0, 5);
  };

  const handleSubmit = () => {
    if (type === 'card') {
      if (!cardNumber || !expiry || !cvc) {
        addNotification({
          type: 'error',
          message: 'Veuillez remplir tous les champs'
        });
        return;
      }
      onSave({
        type: 'card',
        details: {
          cardLast4: cardNumber.slice(-4),
          cardExpiry: expiry
        }
      });
    } else if (type === 'paypal') {
      if (!paypalEmail) {
        addNotification({
          type: 'error',
          message: 'Veuillez entrer votre email PayPal'
        });
        return;
      }
      onSave({
        type: 'paypal',
        details: {
          email: paypalEmail
        }
      });
    } else if (type === 'bank') {
      if (!iban || !bic || !accountName) {
        addNotification({
          type: 'error',
          message: 'Veuillez remplir tous les champs'
        });
        return;
      }
      onSave({
        type: 'bank',
        details: {
          iban,
          bic,
          accountName
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setType('card')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            type === 'card'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-purple-200'
          }`}
        >
          <CreditCard className="h-6 w-6 mx-auto mb-2 text-gray-400" />
          <div className="text-sm font-medium">Carte bancaire</div>
          <div className="mt-2 flex justify-center space-x-2">
            <VisaIcon className="h-6" />
            <MastercardIcon className="h-6" />
          </div>
        </button>

        <button
          onClick={() => setType('paypal')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            type === 'paypal'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-purple-200'
          }`}
        >
          <Wallet className="h-6 w-6 mx-auto mb-2 text-gray-400" />
          <div className="text-sm font-medium">PayPal</div>
          <div className="mt-2 flex justify-center">
            <PayPalIcon className="h-6" />
          </div>
        </button>

        <button
          onClick={() => setType('bank')}
          className={`p-4 rounded-lg border-2 transition-colors ${
            type === 'bank'
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:border-purple-200'
          }`}
        >
          <Building2 className="h-6 w-6 mx-auto mb-2 text-gray-400" />
          <div className="text-sm font-medium">Virement bancaire</div>
          <div className="mt-2 flex justify-center">
            <BankTransferIcon className="h-6" />
          </div>
        </button>
      </div>

      <div className="space-y-4">
        {type === 'card' && (
          <>
            <Input
              label="Numéro de carte"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date d'expiration"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
              <Input
                label="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                maxLength={3}
                placeholder="123"
                required
              />
            </div>
          </>
        )}

        {type === 'paypal' && (
          <Input
            label="Email PayPal"
            type="email"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            placeholder="email@exemple.com"
            required
          />
        )}

        {type === 'bank' && (
          <>
            <Input
              label="Titulaire du compte"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
            <Input
              label="IBAN"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              required
            />
            <Input
              label="BIC"
              value={bic}
              onChange={(e) => setBic(e.target.value)}
              required
            />
          </>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          Ajouter
        </Button>
      </div>
    </div>
  );
}