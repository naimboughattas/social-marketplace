import dotenv from "dotenv";

dotenv.config();

import {
  isTikTokAccessTokenResponse,
  isTikTokUserInfoResponse,
  TikTokAccessTokenResponse,
  TikTokUserInfoResponse,
  TikTokVideoListResponse,
} from "./types"; // Importe l'interface TikTokAccessTokenResponse

export const refreshFacebookAccessToken = async (
  refreshToken: string
): Promise<TikTokAccessTokenResponse> => {
  const url = "https://open.tiktokapis.com/v2/oauth/token/";

  // Construction du body de la requête
  const body = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY as string,
    client_secret: process.env.TIKTOK_CLIENT_SECRET as string,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  // Récupérer la réponse en JSON
  const data: unknown = await response.json();
  console.log("TikTok Access Token:", data);

  // Vérification de la structure des données avec un type guard
  if (isTikTokAccessTokenResponse(data)) {
    return data;
  } else {
    throw new Error("Invalid TikTok access token response");
  }
};

export const getTikTokAccessToken = async (
  code: string
): Promise<TikTokAccessTokenResponse> => {
  const url = "https://open.tiktokapis.com/v2/oauth/token/";

  // Construction du body de la requête
  const body = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY as string,
    client_secret: process.env.TIKTOK_CLIENT_SECRET as string,
    code,
    grant_type: "authorization_code",
    redirect_uri: `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/tiktok`,
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data: unknown = await response.json();

  // Vérification que les données sont du bon type
  if (isTikTokAccessTokenResponse(data)) {
    return data;
  } else {
    throw new Error("Invalid response structure");
  }
};

export const getTikTokUserInfo = async (
  accessToken: string
): Promise<TikTokUserInfoResponse> => {
  const url = `https://open.tiktokapis.com/v2/user/info/?fields=is_verified,open_id,union_id,avatar_url,username,follower_count,following_count,likes_count,video_count`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Récupérer la réponse en JSON
    const data = await response.json();
    const responseData = data as { error: { code: string; message: string } };
    if (responseData.error.code !== "ok")
      throw new Error(responseData.error.message);

    // Vérification de la structure de la réponse avec un type guard
    if (isTikTokUserInfoResponse(data)) {
      return data;
    } else {
      throw new Error("Invalid TikTok user info response");
    }
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

export const getTikTokVideos = async (
  accessToken: string
): Promise<TikTokVideoListResponse> => {
  const url =
    "https://open.tiktokapis.com/v2/video/list/?fields=cover_image_url,id,title";

  // Construction du body de la requête
  const body = JSON.stringify({
    cursor: 0,
    max_count: 10,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body,
    });

    // Récupérer la réponse en JSON et l'assertion de type
    const data = (await response.json()) as TikTokVideoListResponse;
    return data;
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};
