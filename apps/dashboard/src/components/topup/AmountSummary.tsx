import { cn } from '../../lib/utils';

interface AmountSummaryProps {
  amount: number;
  showDetails?: boolean;
  className?: string;
}

export default function AmountSummary({ amount, showDetails = true, className }: AmountSummaryProps) {
  const tva = amount * 0.20;
  const total = amount + tva;

  if (!showDetails) {
    return (
      <div className={cn("text-lg font-medium", className)}>
        {total.toFixed(2)} € TTC
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-sm text-purple-700">
          Le montant crédité sur votre compte sera de <span className="font-bold">{amount.toFixed(2)} €</span> (HT).
          La TVA est appliquée uniquement sur la transaction.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Montant HT</span>
          <span className="font-medium">{amount.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">TVA (20%)</span>
          <span className="font-medium">{tva.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-base font-medium border-t pt-2">
          <span>Total à payer TTC</span>
          <span className="text-lg text-purple-600">{total.toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
}