export interface Ticket {
  id: string;
  subject: string;
  status: "open" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  lastUpdate: Date;
  messages: {
    id: string;
    sender: "user" | "support";
    content: string;
    timestamp: Date;
  }[];
}
