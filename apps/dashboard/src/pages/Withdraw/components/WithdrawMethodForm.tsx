import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { useNotifications } from '../../../lib/notifications';
import { WithdrawMethod } from '../types';

interface WithdrawMethodFormProps {
  onSave: (method: WithdrawMethod) => void;
  onCancel: () => void;
}

export default function WithdrawMethodForm({
  onSave,
  onCancel
}: WithdrawMethodFormProps) {
  const { addNotification } = useNotifications();
  const [type, setType] = useState<'bank' | 'paypal'>('bank');
  const [accountName, setAccountName] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  const handleSubmit = () => {
    if (type === 'bank') {
      if (!accountName || !iban || !bic) {
        addNotification({
          type: 'error',
          message: 'Veuillez remplir tous les champs'
        });
        return;
      }
    } else if (type === 'paypal') {
      if (!paypalEmail) {
        addNotification({
          type: 'error',
          message: 'Veuillez entrer votre email PayPal'
        });
        return;
      }
    }

    const method: WithdrawMethod = {
      id: crypto.randomUUID(),
      type,
      name: type === 'bank' ? 'Virement bancaire' : 'PayPal',
      details: type === 'bank' 
        ? { accountName, iban, bic }
        : { paypalEmail },
      isDefault: false
    };

    onSave(method);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Nouvelle méthode de retrait</h3>
        <button onClick={onCancel}>
          <X className="h-6 w-6 text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type de paiement
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'bank' | 'paypal')}
            className="w-full rounded-md border border-gray-200 p-2"
          >
            <option value="bank">Virement bancaire</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

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

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}