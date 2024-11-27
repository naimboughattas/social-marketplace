import { useState, useEffect } from 'react';
import { useNotifications } from '../lib/notifications';

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

export function useBillingProfiles() {
  const { addNotification } = useNotifications();
  const [profiles, setProfiles] = useState<BillingProfile[]>(() => {
    const saved = localStorage.getItem('billing_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('billing_profiles', JSON.stringify(profiles));
  }, [profiles]);

  const addProfile = (profile: Omit<BillingProfile, 'id' | 'isDefault'>) => {
    const newProfile = {
      ...profile,
      id: crypto.randomUUID(),
      isDefault: profiles.length === 0
    };
    setProfiles([...profiles, newProfile]);
  };

  const removeProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  const setDefaultProfile = (id: string) => {
    setProfiles(profiles.map(p => ({
      ...p,
      isDefault: p.id === id
    })));
  };

  return {
    profiles,
    addProfile,
    removeProfile,
    setDefaultProfile
  };
}