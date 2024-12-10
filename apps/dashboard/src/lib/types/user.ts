export interface User {
  id: string;
  email: string;
  role: "business" | "influencer" | "admin";
  balance: number;
  pendingBalance?: number;
  name?: string;
  company?: string;
}
