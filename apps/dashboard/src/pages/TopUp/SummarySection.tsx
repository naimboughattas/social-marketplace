import BankTransferInstructions from '../../components/topup/BankTransferInstructions';
import AmountSummary from '../../components/topup/AmountSummary';
import Button from '../../components/Button';

interface SummarySectionProps {
  amount: number;
  paymentMethodId: string;
  onConfirm: () => void;
}

export default function SummarySection({
  amount,
  paymentMethodId,
  onConfirm
}: SummarySectionProps) {
  const methods = JSON.parse(localStorage.getItem('payment_methods') || '[]');
  const selectedMethod = methods.find((m: any) => m.id === paymentMethodId);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Récapitulatif</h3>
      {selectedMethod?.type === 'bank' ? (
        <BankTransferInstructions
          amount={amount}
          onConfirm={onConfirm}
        />
      ) : (
        <>
          <AmountSummary amount={amount} />
          <Button
            className="w-full mt-6 py-4 text-lg font-medium transition-transform active:scale-95"
            onClick={onConfirm}
          >
            Payer {(amount * 1.20).toFixed(2)} € TTC
          </Button>
        </>
      )}
    </div>
  );
}