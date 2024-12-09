import { useAuth } from '../../lib/auth';
import BankTransferInstructions from '../../components/topup/BankTransferInstructions';
import AmountSummary from '../../components/topup/AmountSummary';
import Button from '../../components/Button';
import Switch from '../../components/Switch';

interface SummarySectionProps {
  amount: number;
  paymentMethodId: string;
  onConfirm: () => void;
  useEarnings: boolean;
  onUseEarningsChange: (value: boolean) => void;
}

export default function SummarySection({
  amount,
  paymentMethodId,
  onConfirm,
  useEarnings,
  onUseEarningsChange
}: SummarySectionProps) {
  const { user } = useAuth();
  const methods = JSON.parse(localStorage.getItem('payment_methods') || '[]');
  const selectedMethod = methods.find((m: any) => m.id === paymentMethodId);

  // Calculer le montant à payer après utilisation des gains
  const earningsToUse = useEarnings ? Math.min(amount, user?.pendingBalance || 0) : 0;
  const remainingAmount = amount - earningsToUse;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Récapitulatif</h3>

      {user?.pendingBalance && user.pendingBalance > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">
                Vous avez {user.pendingBalance.toFixed(2)} € dans vos gains.
                Souhaitez-vous les utiliser pour recharger votre solde ?
              </p>
              {useEarnings && earningsToUse < amount && (
                <p className="mt-2 text-sm text-purple-600">
                  {earningsToUse.toFixed(2)} € seront utilisés depuis vos gains.
                  Le reste ({remainingAmount.toFixed(2)} €) sera prélevé via votre moyen de paiement.
                </p>
              )}
            </div>
            <Switch
              checked={useEarnings}
              onChange={onUseEarningsChange}
            />
          </div>
        </div>
      )}

      {selectedMethod?.type === 'bank' ? (
        <BankTransferInstructions
          amount={remainingAmount}
          onConfirm={onConfirm}
        />
      ) : (
        <>
          <AmountSummary amount={remainingAmount} />
          <Button
            className="w-full mt-6 py-4 text-lg font-medium transition-transform active:scale-95"
            onClick={onConfirm}
          >
            {remainingAmount > 0 ? (
              `Payer ${(remainingAmount * 1.20).toFixed(2)} € TTC`
            ) : (
              'Confirmer le transfert'
            )}
          </Button>
        </>
      )}
    </div>
  );
}