import { useState, useEffect } from 'react';
import { useNotifications } from '../lib/notifications';

interface AutoRechargeSettings {
  enabled: boolean;
  amount: string;
  minimumBalance: string;
  monthlyLimit: string;
  paymentMethodId: string | null;
}

const defaultSettings: AutoRechargeSettings = {
  enabled: false,
  amount: '200',
  minimumBalance: '10',
  monthlyLimit: '5000',
  paymentMethodId: null
};

export function useAutoRecharge() {
  const { addNotification } = useNotifications();
  const [settings, setSettings] = useState<AutoRechargeSettings>(() => {
    const saved = localStorage.getItem('autoRechargeSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('autoRechargeSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AutoRechargeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const saveSettings = () => {
    localStorage.setItem('autoRechargeSettings', JSON.stringify(settings));
    addNotification({
      type: 'success',
      message: 'Paramètres de rechargement automatique enregistrés'
    });
  };

  return {
    settings,
    updateSettings,
    saveSettings
  };
}