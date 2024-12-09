export interface FacebookAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface FacebookUserResponse {
  id: string;
  name: string;
  picture: {
    data: {
      url: string;
    };
  };
  friends: {
    summary: {
      total_count: number;
    };
  };
}

export interface FacebookPost {
  id: string;
  type: string;
  properties: any; // Propriétés génériques (peut être un objet ou null)
  caption: string | null;
  message: string | null;
  name: string | null;
  created_time: string;
  description: string | null;
  full_picture: string | null;
  permalink_url: string;
  updated_time: string;
}

export interface FacebookPostsResponse {
  data: FacebookPost[];
}

// Type guard pour vérifier la structure des données
export const isFacebookAccessTokenResponse = (
  data: unknown
): data is FacebookAccessTokenResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "access_token" in data &&
    typeof (data as any).access_token === "string" &&
    "token_type" in data &&
    typeof (data as any).token_type === "string" &&
    "expires_in" in data &&
    typeof (data as any).expires_in === "number"
  );
};

// Type guard pour vérifier la structure de la réponse
export const isFacebookUserResponse = (
  data: unknown
): data is FacebookUserResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof (data as any).id === "string" &&
    "name" in data &&
    typeof (data as any).name === "string" &&
    "picture" in data &&
    typeof (data as any).picture === "object" &&
    "data" in (data as any).picture &&
    typeof (data as any).picture.data.url === "string" &&
    "friends" in data &&
    typeof (data as any).friends === "object" &&
    "data" in (data as any).friends &&
    Array.isArray((data as any).friends.data)
  );
};

// Type guard pour vérifier la structure de la réponse
export const isFacebookPostsResponse = (
  data: unknown
): data is FacebookPostsResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    Array.isArray((data as any).data) &&
    (data as any).data.every((post: any) => isFacebookPost(post))
  );
};

// Type guard pour vérifier une publication spécifique
export const isFacebookPost = (post: unknown): post is FacebookPost => {
  return (
    typeof post === "object" &&
    post !== null &&
    "id" in post &&
    typeof (post as any).id === "string" &&
    "type" in post &&
    typeof (post as any).type === "string" &&
    "properties" in post &&
    "caption" in post &&
    (typeof (post as any).caption === "string" ||
      (post as any).caption === null) &&
    "message" in post &&
    (typeof (post as any).message === "string" ||
      (post as any).message === null) &&
    "name" in post &&
    (typeof (post as any).name === "string" || (post as any).name === null) &&
    "created_time" in post &&
    typeof (post as any).created_time === "string" &&
    "description" in post &&
    (typeof (post as any).description === "string" ||
      (post as any).description === null) &&
    "full_picture" in post &&
    (typeof (post as any).full_picture === "string" ||
      (post as any).full_picture === null) &&
    "permalink_url" in post &&
    typeof (post as any).permalink_url === "string" &&
    "updated_time" in post &&
    typeof (post as any).updated_time === "string"
  );
};
