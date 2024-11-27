export interface WithdrawMethod {
  id: string;
  type: 'bank' | 'paypal';
  name: string;
  details: {
    iban?: string;
    bic?: string;
    accountName?: string;
    paypalEmail?: string;
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