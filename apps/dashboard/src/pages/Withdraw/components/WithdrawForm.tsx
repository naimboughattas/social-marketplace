import Input from '../../../components/Input';

interface WithdrawFormProps {
  amount: string;
  onAmountChange: (amount: string) => void;
  maxAmount: number;
}

export default function WithdrawForm({
  amount,
  onAmountChange,
  maxAmount
}: WithdrawFormProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Montant à retirer
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <Input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          min="0"
          step="0.01"
          placeholder="0.00"
          required
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">€</span>
        </div>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Gains disponibles: {maxAmount.toFixed(2)} €
      </p>
    </div>
  );
}