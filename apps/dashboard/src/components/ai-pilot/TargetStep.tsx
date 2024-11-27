import Input from '../Input';
import { Service } from '../../lib/types';

interface TargetStepProps {
  service: Service;
  target: string;
  onTargetChange: (value: string) => void;
}

export default function TargetStep({
  service,
  target,
  onTargetChange
}: TargetStepProps) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Compte cible</h3>
      <Input
        label="Nom d'utilisateur"
        value={target}
        onChange={(e) => onTargetChange(e.target.value)}
        placeholder="@votrecompte"
        required
      />
    </div>
  );
}