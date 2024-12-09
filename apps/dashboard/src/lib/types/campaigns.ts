export type CampaignStatus =
  | "pending"
  | "in_progress"
  | "delivered"
  | "completed"
  | "refused"
  | "archived";
export type Service = "follow" | "like" | "comment" | "repost_story";

export interface Campaign {
  id: string;
  campaignNumber: number;
  date: Date;
  influencer: {
    id: string;
    username: string;
    profileImage: string;
  };
  service: Service;
  target: string;
  price: number;
  status: CampaignStatus;
  acceptedAt: Date | null;
  deliveredAt: Date | null;
  disputeReason?: string;
}

export const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  delivered: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  refused: "bg-red-100 text-red-800",
  archived: "bg-gray-100 text-gray-800",
};

export const STATUS_LABELS = {
  pending: "En attente",
  in_progress: "En cours",
  delivered: "Livrée",
  completed: "Terminée",
  refused: "Refusée",
  archived: "Archivée",
};
