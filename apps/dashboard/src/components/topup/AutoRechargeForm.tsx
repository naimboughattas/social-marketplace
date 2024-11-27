import { Info } from 'lucide-react';
import Button from '../Button';
import Input from '../Input';
import Switch from '../Switch';
import * as Tooltip from '@radix-ui/react-tooltip';

interface AutoRechargeFormProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  minimumBalance: string;
  onMinimumBalanceChange: (balance: string) => void;
  monthlyLimit: string;
  onMonthlyLimitChange: (limit: string) => void;
  onSave: () => void;
}

export default function AutoRechargeForm({
  enabled,
  onEnabledChange,
  amount,
  onAmountChange,
  minimumBalance,
  onMinimumBalanceChange,
  monthlyLimit,
  onMonthlyLimitChange,
  onSave
}: AutoRechargeFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Rechargement automatique
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Activez le rechargement automatique pour ne jamais manquer de crédits
          </p>
        </div>
        <Switch
          checked={enabled}
          onChange={onEnabledChange}
          label="Activer"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Montant du rechargement
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="200"
            disabled={!enabled}
            min="0"
          />
          <p className="mt-1 text-sm text-gray-500">
            Montant qui sera ajouté à votre compte lors du rechargement automatique
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Seuil minimum
          </label>
          <Input
            type="number"
            value={minimumBalance}
            onChange={(e) => onMinimumBalanceChange(e.target.value)}
            placeholder="10"
            disabled={!enabled}
            min="0"
          />
          <p className="mt-1 text-sm text-gray-500">
            Le rechargement s'effectuera lorsque votre solde passera sous ce montant
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Limite mensuelle
          </label>
          <Input
            type="number"
            value={monthlyLimit}
            onChange={(e) => onMonthlyLimitChange(e.target.value)}
            placeholder="5000"
            disabled={!enabled}
            min="0"
          />
          <p className="mt-1 text-sm text-gray-500">
            Montant maximum de rechargements automatiques par mois
          </p>
        </div>

        {enabled && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Paramètres actuels
            </h4>
            <p className="text-sm text-blue-700">
              Nous ajouterons {amount}€ chaque fois que votre solde descendra en dessous de {minimumBalance}€ 
              et nous ne dépasserons jamais {monthlyLimit}€ par mois.
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onSave}
            disabled={!enabled}
          >
            Enregistrer les paramètres
          </Button>
        </div>
      </div>
    </div>
  );
}