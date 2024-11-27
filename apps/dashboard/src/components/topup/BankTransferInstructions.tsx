import { generatePaymentReference } from '../../lib/payment-reference';
import Button from '../Button';
import { useNotifications } from '../../lib/notifications';
import AmountSummary from './AmountSummary';

interface BankTransferInstructionsProps {
  amount: number;
  onConfirm: () => void;
}

const BANK_INFO = {
  name: 'SocialBoost SAS',
  iban: 'FR76 1234 5678 9012 3456 7890 123',
  bic: 'BNPAFRPP',
  bank: 'BNP Paribas'
};

export default function BankTransferInstructions({ amount, onConfirm }: BankTransferInstructionsProps) {
  const { addNotification } = useNotifications();
  const reference = generatePaymentReference();

  const handleCopyReference = () => {
    navigator.clipboard.writeText(reference);
    addNotification({
      type: 'success',
      message: 'Référence copiée dans le presse-papier'
    });
  };

  return (
    <div className="space-y-6">
      <AmountSummary amount={amount} />

      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Instructions de virement</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Bénéficiaire</p>
              <p className="font-medium">{BANK_INFO.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Banque</p>
              <p className="font-medium">{BANK_INFO.bank}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">IBAN</p>
              <p className="font-medium font-mono">{BANK_INFO.iban}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">BIC</p>
              <p className="font-medium font-mono">{BANK_INFO.bic}</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="font-medium text-yellow-800 mb-2">Important : Référence à indiquer</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 font-mono text-lg bg-white p-2 rounded border border-yellow-300 text-center">
                {reference}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyReference}
              >
                Copier
              </Button>
            </div>
            <p className="mt-3 text-sm text-yellow-700">
              Cette référence est obligatoire pour identifier votre paiement.
              Votre compte sera crédité dès réception et validation du virement par notre équipe.
            </p>
          </div>
        </div>
      </div>

      <Button 
        onClick={onConfirm}
        className="w-full py-4 text-lg font-medium transition-transform active:scale-95"
      >
        J'ai effectué le virement de {(amount * 1.20).toFixed(2)} € TTC
      </Button>
    </div>
  );
}