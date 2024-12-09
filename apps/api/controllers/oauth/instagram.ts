import { Request, Response } from "express";
import dotenv from "dotenv";
import { deleteCachedData, getCachedData } from "../../lib/redis";
import { InstagramAccount } from "./types";
import { createDocument } from "../firebase";
import {
  getInstagramAccessToken,
  getInstagramUserMedia,
  getInstagramUserProfile,
  refreshInstagramAccessToken,
} from "../../lib/instagram";

dotenv.config();

export const generateAuthURL = (req: Request, res: Response) => {
  res.redirect(
    `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_BASE_URI}/cb/instagram&state=${req.query.userId}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish`
  );
};

export const OAuthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const userId = req.query.state as string;

  try {
    const { access_token, expires_in } = await getAccessToken(code);
    const formData = await getCachedData(userId);
    await deleteCachedData(userId);
    await createDocument("accounts", {
      userId,
      code,
      token: access_token,
      expiresAt: Date.now() + expires_in * 1000,
      ...formData,
    });

    res.redirect(process.env.FRONT_REDIRECT_URI as string);
  } catch (error) {
    res.status(500).json({
      error: "Failed to obtain access token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAccessToken = async (code: string) => {
  const response = await getInstagramAccessToken(code);
  const data = await refreshInstagramAccessToken(response.access_token);
  return data;
};

export const refreshAccessToken = async (
  docData: InstagramAccount,
  updateCallback: (docId: string, updates: any) => void
) => {
  let token = docData.token;
  const isTokenExpired = docData.expiresAt < Date.now();
  if (isTokenExpired) {
    const { access_token, expires_in } =
      await refreshInstagramAccessToken(token);
    await updateCallback(docData.id, {
      token: access_token,
      expiresAt: Date.now() + expires_in * 1000,
    });
    token = access_token;
  }
  return token;
};

export const getUserInfo = async (accessToken: string) => {
  const response = await getInstagramUserProfile(accessToken);
  return response;
};

export const getUserPosts = async (accessToken: string) => {
  const response = await getInstagramUserMedia(accessToken);

  // Transforme la réponse en un tableau de posts
  const posts = response.map((post) => ({
    id: post.id,
    caption: post.caption || "",
    mediaType: post.media_type,
    mediaUrl: post.media_url,
    thumbnailUrl: post.thumbnail_url || null, // Optionnel pour les vidéos
    timestamp: post.timestamp,
    permalink: post.permalink,
  }));

  return posts;
};

export const getUserPage = async (accessToken: string) => {
  const userInfo = await getUserInfo(accessToken);
  const posts = await getUserPosts(accessToken);
  return {
    ...userInfo,
    posts,
  };
};
