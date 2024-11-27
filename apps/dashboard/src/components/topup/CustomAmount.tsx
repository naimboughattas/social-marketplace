import Button from '../Button';
import Input from '../Input';

interface CustomAmountProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  onReset: () => void;
}

export default function CustomAmount({ amount, onAmountChange, onReset }: CustomAmountProps) {
  const getAmountDetails = () => {
    const baseAmount = parseFloat(amount);
    if (!baseAmount || isNaN(baseAmount)) return null;
    const tva = baseAmount * 0.20;
    return {
      ht: baseAmount,
      tva,
      ttc: baseAmount + tva
    };
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Montant personnalisé
      </h3>
      <div className="flex gap-4">
        <Input
          type="number"
          placeholder="Entrez un montant HT..."
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="flex-1"
        />
        <Button
          variant="outline"
          onClick={onReset}
        >
          Réinitialiser
        </Button>
      </div>
      {getAmountDetails() && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Montant HT</span>
            <span>{getAmountDetails()?.ht.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">TVA (20%)</span>
            <span>{getAmountDetails()?.tva.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-base font-medium border-t pt-2">
            <span>Total TTC</span>
            <span>{getAmountDetails()?.ttc.toFixed(2)} €</span>
          </div>
        </div>
      )}
    </div>
  );
}