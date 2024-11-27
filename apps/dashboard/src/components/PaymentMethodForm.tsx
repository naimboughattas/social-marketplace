import { useState } from 'react';
import Button from './Button';
import Input from './Input';
import { useNotifications } from '../lib/notifications';
import { generatePaymentReference } from '../lib/payment-reference';

interface PaymentMethodFormProps {
  method: 'card' | 'bank' | 'paypal';
  amount?: number;
  onSave?: (data: any) => void;
  onPaymentComplete?: () => void;
  isNewMethod?: boolean;
  savedMethod?: any;
}

export default function PaymentMethodForm({ 
  method, 
  amount, 
  onSave, 
  onPaymentComplete,
  isNewMethod,
  savedMethod
}: PaymentMethodFormProps) {
  const { addNotification } = useNotifications();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [accountName, setAccountName] = useState('');
  const [reference] = useState(() => generatePaymentReference());

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

  const handleSave = () => {
    if (method === 'card') {
      if (!cardNumber || !expiry || !cvc) {
        addNotification({
          type: 'error',
          message: 'Veuillez remplir tous les champs'
        });
        return;
      }
      onSave?.({
        type: 'card',
        name: 'Carte bancaire',
        details: {
          cardLast4: cardNumber.slice(-4),
          cardExpiry: expiry
        }
      });
    } else if (method === 'paypal') {
      if (!paypalEmail) {
        addNotification({
          type: 'error',
          message: 'Veuillez entrer votre email PayPal'
        });
        return;
      }
      onSave?.({
        type: 'paypal',
        name: 'PayPal',
        details: {
          email: paypalEmail
        }
      });
    } else if (method === 'bank') {
      if (!iban || !bic || !accountName) {
        addNotification({
          type: 'error',
          message: 'Veuillez remplir tous les champs'
        });
        return;
      }
      onSave?.({
        type: 'bank',
        name: 'Virement bancaire',
        details: {
          iban,
          bic,
          accountName
        }
      });
    }
  };

  const handlePayment = async () => {
    try {
      // Simulate payment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (method === 'bank') {
        addNotification({
          type: 'success',
          message: 'Votre demande a été enregistrée. Nous traiterons votre paiement dès réception du virement.'
        });
      } else {
        addNotification({
          type: 'success',
          message: 'Paiement effectué avec succès'
        });
      }
      
      onPaymentComplete?.();
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Erreur lors du paiement'
      });
    }
  };

  if (isNewMethod) {
    switch (method) {
      case 'card':
        return (
          <div className="space-y-4">
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

            <Button onClick={handleSave} className="w-full">
              Enregistrer la carte
            </Button>
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-4">
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
            <Button onClick={handleSave} className="w-full">
              Enregistrer le compte
            </Button>
          </div>
        );

      case 'paypal':
        return (
          <div className="space-y-4">
            <Input
              label="Email PayPal"
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="email@exemple.com"
              required
            />
            <Button onClick={handleSave} className="w-full">
              Enregistrer PayPal
            </Button>
          </div>
        );
    }
  }

  // Payment with saved method
  if (method === 'bank') {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Instructions de virement</h4>
          <div className="space-y-2">
            <p><span className="font-medium">Bénéficiaire :</span> SocialBoost SAS</p>
            <p><span className="font-medium">IBAN :</span> FR76 1234 5678 9012 3456 7890 123</p>
            <p><span className="font-medium">BIC :</span> BNPAFRPP</p>
            <p><span className="font-medium">Banque :</span> BNP Paribas</p>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="font-medium text-yellow-800 mb-2">Important : Référence à indiquer</p>
              <p className="font-mono text-lg bg-white p-2 rounded border border-yellow-300 text-center">
                {reference}
              </p>
              <p className="mt-3 text-sm text-yellow-700">
                Cette référence est obligatoire pour identifier votre paiement.
                Votre compte sera crédité dès réception et validation du virement par notre équipe.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handlePayment} className="w-full">
          J'ai effectué le virement de {amount?.toFixed(2)} €
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handlePayment} className="w-full">
      Payer {amount?.toFixed(2)} €
    </Button>
  );
}