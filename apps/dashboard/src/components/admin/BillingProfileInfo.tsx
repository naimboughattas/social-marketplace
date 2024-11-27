interface BillingProfile {
  id: string;
  companyName: string;
  fullName: string;
  address: string;
  city: string;
  region: string;
  zipCode: string;
  country: string;
  taxId?: string;
  isDefault: boolean;
}

interface BillingProfileInfoProps {
  profile: BillingProfile;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}

export default function BillingProfileInfo({ 
  profile,
  onEdit,
  onDelete,
  onSetDefault
}: BillingProfileInfoProps) {
  return (
    <div className="p-4 rounded-lg bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900">
          {profile.companyName}
        </h4>
        {profile.isDefault && (
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
            Par défaut
          </span>
        )}
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p>{profile.fullName}</p>
        <p>{profile.address}</p>
        <p>{profile.zipCode} {profile.city}</p>
        <p>{profile.region}</p>
        <p>{profile.country}</p>
        {profile.taxId && (
          <p className="text-xs text-gray-500">N° TVA : {profile.taxId}</p>
        )}
      </div>
      {(onEdit || onDelete || onSetDefault) && (
        <div className="flex justify-end space-x-2 mt-4">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              Supprimer
            </Button>
          )}
          {onSetDefault && !profile.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSetDefault}
            >
              Définir par défaut
            </Button>
          )}
        </div>
      )}
    </div>
  );
}