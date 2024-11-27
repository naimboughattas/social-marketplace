import Button from '../../../components/Button';

interface WithdrawSummaryProps {
  amount: number;
  onConfirm: () => void;
}

export default function WithdrawSummary({
  amount,
  onConfirm
}: WithdrawSummaryProps) {
  const commission = amount * 0.15; // 15% commission
  const netAmount = amount - commission;
  const tva = netAmount * 0.20; // 20% TVA

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-sm text-purple-700">
          Le montant retiré sera de <span className="font-bold">{amount.toFixed(2)} €</span>.
          La commission et la TVA sont appliquées uniquement sur la transaction.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Montant brut</span>
          <span className="font-medium">{amount.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Commission (15%)</span>
          <span className="text-red-600">-{commission.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-base font-medium border-t pt-2">
          <span>Montant net</span>
          <span>{netAmount.toFixed(2)} € <span className="text-sm font-normal text-gray-500">(dont TVA {tva.toFixed(2)} €)</span></span>
        </div>
      </div>

      <Button
        className="w-full"
        onClick={onConfirm}
      >
        Confirmer le retrait
      </Button>
    </div>
  );
}