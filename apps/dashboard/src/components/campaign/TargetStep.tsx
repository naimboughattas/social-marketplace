import Input from "../Input";
import { Service } from "../../lib/types";
import { useAccounts } from "../../lib/hooks/useAccounts";
import AccountCard from "../AccountCard";
import AccountBanner from "../AccountBanner";

interface TargetStepProps {
  service: Service;
  target: string;
  onTargetChange: (target: string) => void;
}

export default function TargetStep({
  service,
  target,
  onTargetChange,
}: TargetStepProps) {
  const { accounts } = useAccounts();
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Compte cible</h3>
      <div className="grid grid-cols-3">
        {accounts.map((account) => (
          <AccountBanner
            key={account.id}
            accountId={account.id}
            onSelect={() => onTargetChange(account.id)}
          />
        ))}
      </div>
    </div>
  );
}
