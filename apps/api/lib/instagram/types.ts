export interface InstagramAccessTokenResponse {
  access_token: string;
  user_id: string;
  expires_in: number;
}

export interface InstagramUserProfile {
  id: string;
  user_id: string;
  username: string;
  name: string;
  account_type: string;
  profile_picture_url: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
}

export interface InstagramMedia {
  id: string;
  caption: string | null; // Le caption peut être nul
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL"; // Types de médias possibles
  media_url: string;
  thumbnail_url: string | null; // La miniature peut être nulle pour certains médias
  timestamp: string; // Date au format ISO 8601
  permalink: string;
}

export interface InstagramMediaResponse {
  data: InstagramMedia[];
}

// Type guard pour vérifier la structure de la réponse
export const isInstagramAccessTokenResponse = (
  data: unknown
): data is InstagramAccessTokenResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "access_token" in data &&
    typeof (data as any).access_token === "string" &&
    "user_id" in data &&
    typeof (data as any).user_id === "number"
  );
};

export const isInstagramUserProfile = (
  data: unknown
): data is InstagramUserProfile => {
  return (
    typeof data === "object" &&
    data !== null &&
    "user_id" in data &&
    typeof (data as any).user_id === "string" &&
    "username" in data &&
    typeof (data as any).username === "string" &&
    "name" in data &&
    typeof (data as any).name === "string" &&
    "account_type" in data &&
    typeof (data as any).account_type === "string" &&
    "profile_picture_url" in data &&
    typeof (data as any).profile_picture_url === "string" &&
    "followers_count" in data &&
    typeof (data as any).followers_count === "number" &&
    "follows_count" in data &&
    typeof (data as any).follows_count === "number" &&
    "media_count" in data &&
    typeof (data as any).media_count === "number"
  );
};

// Type guard pour vérifier la structure de la réponse
export const isInstagramMediaResponse = (
  data: unknown
): data is InstagramMediaResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray((data as any).data) &&
    (data as any).data.every(isInstagramMedia)
  );
};

// Type guard pour vérifier la structure de chaque élément de `data`
export const isInstagramMedia = (data: unknown): data is InstagramMedia => {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof (data as any).id === "string" &&
    "media_type" in data &&
    ["IMAGE", "VIDEO", "CAROUSEL"].includes((data as any).media_type) &&
    "media_url" in data &&
    typeof (data as any).media_url === "string" &&
    "timestamp" in data &&
    typeof (data as any).timestamp === "string" &&
    "permalink" in data &&
    typeof (data as any).permalink === "string"
  );
};
