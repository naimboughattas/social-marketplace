import dotenv from "dotenv";
import {
  isLinkedInUserProfile,
  LinkedInUserProfile,
  LinkedInAccessTokenResponse,
  isLinkedInAccessTokenResponse,
} from "./types"; // Importe l'interface LinkedInUserProfile

dotenv.config();

export const getLinkedInUserProfile = async (
  accessToken: string
): Promise<LinkedInUserProfile> => {
  const url = "https://api.linkedin.com/v2/userinfo";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Récupérer la réponse en JSON
    const userData: unknown = await response.json();
    console.log("LinkedIn User Profile:", userData);  

    // Vérification de la structure des données avec un type guard
    if (isLinkedInUserProfile(userData)) {
      return userData;
    } else {
      throw new Error("Invalid LinkedIn user profile response");
    }
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

export const getLinkedInAccessToken = async (
  code: string
): Promise<LinkedInAccessTokenResponse> => {
  const url = "https://www.linkedin.com/oauth/v2/accessToken";

  // Construction du body de la requête
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.LINKEDIN_CLIENT_ID as string,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET as string,
    code,
    redirect_uri: `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/linkedin`,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    // Récupérer la réponse en JSON
    const data: unknown = await response.json();

    // Vérification de la structure des données avec un type guard
    if (isLinkedInAccessTokenResponse(data)) {
      return data;
    } else {
      throw new Error("Invalid LinkedIn access token response");
    }
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};
