export interface Dispute {
  id: string;
  orderNumber: number;
  date: Date;
  service: "follow" | "like" | "comment" | "repost_story";
  influencer: {
    username: string;
    avatar: string;
  };
  reason: string;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  messages: {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
  }[];
}
