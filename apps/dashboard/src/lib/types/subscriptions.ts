type SubscriptionType = "follow" | "like" | "comment" | "repost_story";
type SubscriptionStatus = "active" | "paused" | "cancelled";

export interface Subscription {
  id: string;
  type: SubscriptionType;
  influencer: {
    username: string;
    profileImage: string;
  };
  target: string;
  price: number;
  status: SubscriptionStatus;
  nextRenewal?: Date;
  startDate: Date;
  lastExecution?: Date;
  history: {
    total: number;
    url: string;
  };
}
