export interface Withdraw {
  id: string;
  type: "bank" | "paypal";
  name: string;
  details: {
    iban?: string;
    bic?: string;
    accountName?: string;
    paypalEmail?: string;
  };
  isDefault: boolean;
}