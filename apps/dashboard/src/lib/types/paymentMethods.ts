export interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "paypal";
  name: string;
  details: {
    cardLast4?: string;
    cardExpiry?: string;
    cardCVC?: string;
    iban?: string;
    bic?: string;
    accountName?: string;
    email?: string;
  };
  isDefault: boolean;
}
