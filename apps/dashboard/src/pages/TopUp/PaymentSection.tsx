import { useEffect, useState } from 'react';
import PaymentMethodSelector from '../../components/topup/PaymentMethodSelector';

interface PaymentSectionProps {
  selectedMethodId: string | null;
  onMethodSelect: (methodId: string) => void;
  onAddMethod: () => void;
}

export default function PaymentSection({
  selectedMethodId,
  onMethodSelect,
  onAddMethod
}: PaymentSectionProps) {
  const [methods] = useState(() => {
    const saved = localStorage.getItem('payment_methods');
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Moyen de paiement</h3>
      <PaymentMethodSelector
        selectedMethodId={selectedMethodId}
        onMethodSelect={onMethodSelect}
        onAddMethod={onAddMethod}
      />
    </div>
  );
}