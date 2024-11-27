import { useState, useEffect } from 'react';
import { useNotifications } from '../lib/notifications';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  details: {
    cardLast4?: string;
    cardExpiry?: string;
    iban?: string;
    email?: string;
  };
  isDefault: boolean;
}

export function usePaymentMethods() {
  const { addNotification } = useNotifications();
  const [methods, setMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('payment_methods');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('payment_methods', JSON.stringify(methods));
  }, [methods]);

  const addMethod = (method: Omit<PaymentMethod, 'id' | 'isDefault'>) => {
    const newMethod = {
      ...method,
      id: crypto.randomUUID(),
      isDefault: methods.length === 0
    };
    setMethods([...methods, newMethod]);
  };

  const removeMethod = (id: string) => {
    setMethods(methods.filter(m => m.id !== id));
  };

  const setDefaultMethod = (id: string) => {
    setMethods(methods.map(m => ({
      ...m,
      isDefault: m.id === id
    })));
  };

  return {
    methods,
    addMethod,
    removeMethod,
    setDefaultMethod
  };
}