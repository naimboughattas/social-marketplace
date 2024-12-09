import { Request, Response } from "express";
import dotenv from "dotenv";
import { deleteCachedData, getCachedData } from "../../lib/redis";
import {
  getFacebookAccessToken,
  getFacebookUserData,
  getFacebookUserPosts,
  refreshFacebookAccessToken,
} from "../../lib/facebook";
import { createDocument } from "../firebase";
import { FacebookAccount } from "./types";

dotenv.config();

export const generateAuthURL = (req: Request, res: Response) => {
  res.redirect(
    `https://www.facebook.com/v21.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_BASE_URI}/cb/facebook&state=${req.query.userId}&scope=public_profile,user_friends,user_videos,user_posts`
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
  const response = await getFacebookAccessToken(code);
  const data = await refreshFacebookAccessToken(response.access_token);
  return data;
};

export const refreshAccessToken = async (
  docData: FacebookAccount,
  updateCallback: (docId: string, updates: any) => void
) => {
  let token = docData.token;
  const isTokenExpired = docData.expiresAt < Date.now();

  if (isTokenExpired) {
    const response = await refreshFacebookAccessToken(token);
    await updateCallback(docData.id, {
      token: response.access_token,
      expiresAt: Date.now() + response.expires_in * 1000,
    });
    token = response.access_token;
  }
  return token;
};

export const getUserInfo = async (accessToken: string) => {
  const response = await getFacebookUserData(accessToken);
  return {
    pageId: response.id,
    name: response.name,
    picture: response.picture.data.url,
    friends: response.friends.summary.total_count,
  };
};

export const getUserPosts = async (accessToken: string) => {
  const response = await getFacebookUserPosts(accessToken);
  return response;
};

export const getUserPage = async (accessToken: string) => {
  const userInfo = await getUserInfo(accessToken);
  const posts = await getUserPosts(accessToken);
  return {
    ...userInfo,
    posts,
  };
};
