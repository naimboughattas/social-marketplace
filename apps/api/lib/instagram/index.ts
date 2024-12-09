import dotenv from "dotenv";
import {
  type InstagramAccessTokenResponse,
  InstagramMedia,
  type InstagramUserProfile,
  isInstagramAccessTokenResponse,
  isInstagramMediaResponse,
  isInstagramUserProfile,
} from "./types"; // Importe l'interface InstagramAccessTokenResponse

dotenv.config();

export const getInstagramAccessToken = async (
  code: string
): Promise<InstagramAccessTokenResponse> => {
  const url = "https://api.instagram.com/oauth/access_token";
  const formData = new URLSearchParams();

  formData.append("client_id", process.env.INSTAGRAM_CLIENT_ID as string);
  formData.append(
    "client_secret",
    process.env.INSTAGRAM_CLIENT_SECRET as string
  );
  formData.append("grant_type", "authorization_code");
  formData.append(
    "redirect_uri",
    `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/instagram`
  );
  formData.append("code", code);
  console.log(`${process.env.OAUTH_REDIRECT_BASE_URI}/cb/instagram`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  // Récupérer la réponse en JSON
  const tokenData: unknown = await response.json();

  // Vérification de la structure des données avec un type guard
  if (isInstagramAccessTokenResponse(tokenData)) {
    return tokenData;
  } else {
    console.log("Instagram Access Token:", tokenData);
    throw new Error("Invalid Instagram access token response");
  }
};

export const exchangeInstagramAccessToken = async (
  token: string
): Promise<InstagramAccessTokenResponse> => {
  const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${token}`;

  try {
    const response = await fetch(url, { method: "GET" });

    // Récupérer la réponse en JSON et l'assertion de type
    const refreshData = (await response.json()) as InstagramAccessTokenResponse;
    console.log("Instagram Access Token Exchanged:", refreshData);

    return refreshData;
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

export const refreshInstagramAccessToken = async (
  token: string
): Promise<InstagramAccessTokenResponse> => {
  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;

  try {
    const response = await fetch(url, { method: "GET" });

    // Récupérer la réponse en JSON et l'assertion de type
    const refreshData = (await response.json()) as InstagramAccessTokenResponse;
    console.log("Instagram Access Token Refreshed:", refreshData);

    return refreshData;
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

export const getInstagramUserProfile = async (
  accessToken: string
): Promise<InstagramUserProfile> => {
  const url = "https://graph.instagram.com/v21.0/me";
  const params = new URLSearchParams({
    fields:
      "user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count",
    access_token: accessToken,
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
    });

    // Récupérer la réponse en JSON
    const userData: unknown = await response.json();

    // Vérification de la structure des données avec un type guard
    if (isInstagramUserProfile(userData)) {
      return userData;
    } else {
      throw new Error("Invalid Instagram user profile response");
    }
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

export const getInstagramUserMedia = async (
  accessToken: string
): Promise<InstagramMedia[]> => {
  const url = `https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const mediaData: unknown = await response.json();

    // Vérification de la structure des données avec un type guard
    if (isInstagramMediaResponse(mediaData)) {
      return mediaData.data;
    } else {
      throw new Error("Invalid Instagram user media response");
    }
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};
