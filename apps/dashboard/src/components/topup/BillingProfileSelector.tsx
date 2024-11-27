import { Building2 } from 'lucide-react';
import Button from '../Button';

interface BillingProfile {
  id: string;
  companyName: string;
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  taxId?: string;
  isDefault: boolean;
}

interface BillingProfileSelectorProps {
  selectedProfileId: string | null;
  onProfileSelect: (profileId: string) => void;
  onAddProfile: () => void;
}

export default function BillingProfileSelector({
  selectedProfileId,
  onProfileSelect,
  onAddProfile
}: BillingProfileSelectorProps) {
  // Récupérer les profils depuis le localStorage
  const profiles: BillingProfile[] = JSON.parse(localStorage.getItem('billing_profiles') || '[]');

  if (profiles.length === 0) {
    return (
      <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Aucun profil de facturation
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Ajoutez un profil de facturation pour continuer
        </p>
        <Button
          className="mt-4"
          onClick={onAddProfile}
        >
          Ajouter un profil
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {profiles.map((profile) => (
        <button
          key={profile.id}
          className={`flex items-center justify-between p-4 border rounded-lg w-full ${
            selectedProfileId === profile.id
              ? 'border-purple-600 bg-purple-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => onProfileSelect(profile.id)}
        >
          <div>
            <div className="font-medium">
              {profile.companyName}
            </div>
            <div className="text-sm text-gray-500">
              {profile.address}, {profile.zipCode} {profile.city}
            </div>
          </div>
          {profile.isDefault && (
            <span className="text-sm text-purple-600 font-medium">
              Par défaut
            </span>
          )}
        </button>
      ))}
    </div>
  );
}