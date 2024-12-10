export interface Payment {
  id: string;
  userId: string;
  amount: number;
  method: "card" | "bank" | "paypal";
  status: "pending" | "completed" | "failed";
  reference: string;
  createdAt: Date;
  completedAt?: Date;
}
