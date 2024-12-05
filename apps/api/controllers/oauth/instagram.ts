import { Request, Response } from "express";
import dotenv from "dotenv";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getCachedData } from "../../lib/redis";
import { OAuthResponse, UserInfo } from "../../types";

dotenv.config();

export type PageData = {
  user_id: string; // ID utilisateur Instagram
  username: string; // Nom d'utilisateur
  name: string; // Nom de la page
  account_type: "MEDIA_CREATOR" | string; // Type de compte (peut inclure d'autres valeurs potentielles)
  profile_picture_url: string; // URL de la photo de profil
  followers_count: number; // Nombre de followers
  follows_count: number; // Nombre de comptes suivis
  media_count: number; // Nombre de posts
  id?: string; // ID unique pour cet utilisateur
};

export type InstagramPost = {
  id: string; // ID unique du post
  caption: string; // Légende du post
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"; // Type de média
  mediaUrl: string; // URL du média
  thumbnailUrl: string | null; // URL de l'aperçu pour les vidéos (optionnel)
  timestamp: string; // Date de création du post (ISO 8601)
  permalink: string; // URL publique du post
};

export const generateAuthURL = (req: Request, res: Response): void => {
  res.redirect(
    `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_BASE_URI}/cb/instagram&state=${req.query.userId}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish`
  );
};

export const OAuthCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const code = req.query.code as string;
  const userId = req.query.state as string;

  try {
    const { access_token, expires_in } = await getAccessToken(code);
    console.log("Token:", access_token);
    const formData = await getCachedData(userId);
    console.log("formData:", formData);

    const accountRef = await addDoc(collection(db, "socialAccounts"), {
      userId,
      code,
      token: access_token,
      expiresAt: Date.now() + expires_in * 1000,
      ...formData,
      createdAt: Timestamp.now(),
    });

    res.redirect(process.env.FRONT_REDIRECT_URI as string);
  } catch (error) {
    console.error("Error while retrieving access token from Instagram:", error);
    res.status(500).json({
      error: "Failed to obtain access token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAccessToken = async (code: string): Promise<OAuthResponse> => {
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

  console.log(
    "OAUTH_REDIRECT_BASE_URI:",
    `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/instagram`
  );

  console.log("Form Data:", formData);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const shortLivedAccessTokenData = await response.json();
    const data = await exchangeForLongLivedToken(
      shortLivedAccessTokenData.access_token
    );
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

const exchangeForLongLivedToken = async (shortLivedAccessToken: string) => {
  const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortLivedAccessToken}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to exchange token: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Long-Lived Access Token:", data.access_token);
    console.log("Expires in:", data.expires_in, "seconds");
    return data;
  } catch (error) {
    console.error("Error exchanging access token:", error.message);
    return null;
  }
};

export const refreshAccessToken = async (
  docData: any,
  updateCallback: (docId: string, updates: any) => void
) => {
  try {
    let token = docData.token;
    const isTokenExpired = docData.expiresAt < Date.now();
    console.log("Is Token Expired:", isTokenExpired);

    if (isTokenExpired) {
      const response = await fetch(
        `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to refresh token: ${response.status} ${response.statusText}`
        );
      }

      const { access_token, expires_in } = await response.json();
      console.log("New Access Token:", access_token);
      console.log("Expires in:", expires_in, "seconds");

      const updatedRef = await updateCallback(docData.id, {
        token: access_token,
        expiresAt: Date.now() + expires_in * 1000,
      });
      console.log("Token updated:", updatedRef);
      token = access_token;
    }
    return token;
  } catch (error) {
    console.error("Error refreshing access token:", error.message);
    return null;
  }
};

export const getUserInfo = async (accessToken: string): Promise<UserInfo> => {
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

    const data = (await response.json()) as PageData;
    // if(data.error) {
    delete data.id;
    console.log("User data:", data);
    return data;
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

export const getUserPosts = async (
  accessToken: string
): Promise<InstagramPost[]> => {
  const url = `https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&access_token=${accessToken}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = (await response.json()) as { data: InstagramPost[] };

    // Transforme la réponse en un tableau de posts
    const posts = data.map((post: any) => ({
      id: post.id,
      caption: post.caption || "",
      mediaType: post.media_type,
      mediaUrl: post.media_url,
      thumbnailUrl: post.thumbnail_url || null, // Optionnel pour les vidéos
      timestamp: post.timestamp,
      permalink: post.permalink,
    }));

    return posts;
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    throw error;
  }
};
