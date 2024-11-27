import { useState } from 'react';
import Button from '../Button';
import Input from '../Input';
import AddressAutocomplete from '../AddressAutocomplete';
import { useNotifications } from '../../lib/notifications';

interface BillingProfileFormProps {
  onSave: (data: any) => void;
}

export default function BillingProfileForm({ onSave }: BillingProfileFormProps) {
  const { addNotification } = useNotifications();
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('France');
  const [taxId, setTaxId] = useState('');

  const handleSubmit = () => {
    if (!companyName || !fullName || !address || !city || !zipCode) {
      addNotification({
        type: 'error',
        message: 'Veuillez remplir tous les champs obligatoires'
      });
      return;
    }

    onSave({
      companyName,
      fullName,
      address,
      city,
      zipCode,
      country,
      taxId
    });
  };

  return (
    <div className="space-y-4">
      <Input
        label="Nom de l'entreprise"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
      />

      <Input
        label="Nom complet"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <AddressAutocomplete
        onSelect={(address) => {
          setAddress(address.street);
          setCity(address.city);
          setZipCode(address.zipCode);
          setCountry(address.country);
        }}
      />

      <Input
        label="Numéro de TVA (optionnel)"
        value={taxId}
        onChange={(e) => setTaxId(e.target.value)}
      />

      <Button onClick={handleSubmit} className="w-full">
        Ajouter
      </Button>
    </div>
  );
}