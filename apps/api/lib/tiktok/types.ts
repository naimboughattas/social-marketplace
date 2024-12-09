export interface TikTokAccessTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  open_id: string;
  scope: string;
  token_type: string;
}

export interface TikTokUserInfo {
  is_verified: boolean;
  open_id: string;
  union_id: string;
  avatar_url: string;
  username: string;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

export interface TikTokUserInfoResponse {
  data: {
    user: TikTokUserInfo;
  };
  error: {
    code: string;
    message: string;
  };
}

export interface TikTokVideo {
  id: string;
  title: string;
  cover_image_url: string;
}

export interface TikTokVideoListResponse {
  data: {
    has_more: boolean;
    cursor: number;
    videos: TikTokVideo[];
  };
  error: {
    code: string;
    message: string;
  };
}

// Type guard pour vérifier la structure de la réponse
export const isTikTokAccessTokenResponse = (
  data: unknown
): data is TikTokAccessTokenResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "access_token" in (data as any) &&
    typeof (data as any).access_token === "string" &&
    "expires_in" in (data as any) &&
    typeof (data as any).expires_in === "number" &&
    "refresh_token" in (data as any) &&
    typeof (data as any).refresh_token === "string" &&
    "refresh_expires_in" in (data as any) &&
    typeof (data as any).refresh_expires_in === "number" &&
    "open_id" in data &&
    typeof (data as any).open_id === "string" &&
    "scope" in data &&
    typeof (data as any).scope === "string" &&
    "token_type" in data &&
    typeof (data as any).token_type === "string"
  );
};

export const isTikTokUserInfoResponse = (
  data: unknown
): data is TikTokUserInfoResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    typeof (data as any).data === "object" &&
    "user" in (data as any).data &&
    typeof (data as any).data.user === "object" &&
    "is_verified" in (data as any).data.user &&
    typeof (data as any).data.user.is_verified === "boolean" &&
    "open_id" in (data as any).data.user &&
    typeof (data as any).data.user.open_id === "string" &&
    "union_id" in (data as any).data.user &&
    typeof (data as any).data.user.union_id === "string" &&
    "avatar_url" in (data as any).data.user &&
    typeof (data as any).data.user.avatar_url === "string" &&
    "username" in (data as any).data.user &&
    typeof (data as any).data.user.username === "string" &&
    "follower_count" in (data as any).data.user &&
    typeof (data as any).data.user.follower_count === "number" &&
    "following_count" in (data as any).data.user &&
    typeof (data as any).data.user.following_count === "number" &&
    "likes_count" in (data as any).data.user &&
    typeof (data as any).data.user.likes_count === "number" &&
    "video_count" in (data as any).data.user &&
    typeof (data as any).data.user.video_count === "number"
  );
};

export const isTikTokVideoListResponse = (
  data: unknown
): data is TikTokVideoListResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    typeof (data as any).data === "object" &&
    "has_more" in (data as any).data &&
    typeof (data as any).data.has_more === "boolean" &&
    "cursor" in (data as any).data &&
    typeof (data as any).data.cursor === "number" &&
    "videos" in (data as any).data &&
    Array.isArray((data as any).data.videos) &&
    (data as any).data.videos.every(
      (video: any) =>
        typeof video.id === "string" &&
        typeof video.title === "string" &&
        typeof video.cover_image_url === "string"
    ) &&
    "message" in data &&
    typeof (data as any).message === "string" &&
    "status_code" in data &&
    typeof (data as any).status_code === "number"
  );
};
