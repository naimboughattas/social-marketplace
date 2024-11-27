export interface PaymentMethod {
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

export interface BillingProfile {
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

export interface AutoRechargeSettings {
  enabled: boolean;
  amount: string;
  minimumBalance: string;
  monthlyLimit: string;
  paymentMethodId: string | null;
}