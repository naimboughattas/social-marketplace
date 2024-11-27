import { useEffect, useState } from 'react';
import BillingProfileSelector from '../../components/topup/BillingProfileSelector';

interface BillingSectionProps {
  selectedProfileId: string | null;
  onProfileSelect: (profileId: string) => void;
  onAddProfile: () => void;
}

export default function BillingSection({
  selectedProfileId,
  onProfileSelect,
  onAddProfile
}: BillingSectionProps) {
  const [profiles] = useState(() => {
    const saved = localStorage.getItem('billing_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Profil de facturation</h3>
      <BillingProfileSelector
        selectedProfileId={selectedProfileId}
        onProfileSelect={onProfileSelect}
        onAddProfile={onAddProfile}
      />
    </div>
  );
}