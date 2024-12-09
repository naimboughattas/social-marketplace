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
  isDefault?: boolean;
}

export interface Invoice {
  id: string;
  date: Date;
  amount: number;
  tva: number;
  description: string;
  paymentMethod: "card" | "bank" | "paypal" | "gains";
}
