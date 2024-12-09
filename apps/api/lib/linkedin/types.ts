export interface LinkedInUserProfile {
  sub: string;
  email_verified: boolean;
  name: string;
  locale: {
    country: string;
    language: string;
  };
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}

export interface LinkedInAccessTokenResponse {
  access_token: string;
  expires_in: number;
}

// Type guard pour vérifier la structure de la réponse
export const isLinkedInUserProfile = (
  data: unknown
): data is LinkedInUserProfile => {
  return (
    typeof data === "object" &&
    data !== null &&
    "sub" in data &&
    typeof (data as any).sub === "string" &&
    "email_verified" in data &&
    typeof (data as any).email_verified === "boolean" &&
    "name" in data &&
    typeof (data as any).name === "string" &&
    "locale" in data &&
    typeof (data as any).locale === "object" &&
    "country" in (data as any).locale &&
    typeof (data as any).locale.country === "string" &&
    "language" in (data as any).locale &&
    typeof (data as any).locale.language === "string" &&
    "given_name" in data &&
    typeof (data as any).given_name === "string" &&
    "family_name" in data &&
    typeof (data as any).family_name === "string" &&
    "email" in data &&
    typeof (data as any).email === "string" &&
    "picture" in data &&
    typeof (data as any).picture === "string"
  );
};

// Type guard pour vérifier la structure de la réponse
export const isLinkedInAccessTokenResponse = (
  data: unknown
): data is LinkedInAccessTokenResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "access_token" in data &&
    typeof (data as any).access_token === "string" &&
    "expires_in" in data &&
    typeof (data as any).expires_in === "number"
  );
};
