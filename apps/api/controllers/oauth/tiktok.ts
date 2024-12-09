import { Request, Response } from "express";
import dotenv from "dotenv";
import { deleteCachedData, getCachedData } from "../../lib/redis";
import { TiktokAccount } from "./types";
import { createDocument } from "../firebase";
import {
  getTikTokAccessToken,
  getTikTokUserInfo,
  getTikTokVideos,
} from "../../lib/tiktok";

dotenv.config();

export const generateAuthURL = async (
  req: Request,
  res: Response
): Promise<void> => {
  const csrfState = Math.random().toString(36).substring(2);
  res.cookie("csrfState", csrfState, { maxAge: 60000 });

  let authUrl = "https://www.tiktok.com/v2/auth/authorize/";
  authUrl += `?client_key=${process.env.TIKTOK_CLIENT_KEY}`;
  authUrl +=
    "&scope=user.info.basic,user.info.profile,user.info.stats,video.list";
  authUrl += "&response_type=code";
  authUrl += `&redirect_uri=${process.env.OAUTH_REDIRECT_BASE_URI}/cb/tiktok`;
  authUrl += `&state=${req.query.userId}`;

  res.redirect(authUrl);
};

export const OAuthCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const code = req.query.code as string;
  const userId = req.query.state as string;

  try {
    const {
      open_id,
      scope,
      access_token,
      expires_in,
      refresh_token,
      refresh_expires_in,
      token_type,
    } = await getAccessToken(code);

    const formData = await getCachedData(userId);
    await deleteCachedData(userId);
    await createDocument("accounts", {
      userId,
      code,
      token: access_token,
      expiresAt: Date.now() + expires_in * 1000,
      refreshToken: refresh_token,
      refreshExpiresAt: Date.now() + refresh_expires_in * 1000,
      openId: open_id,
      scope,
      tokenType: token_type,
      ...formData,
    });

    res.redirect(process.env.FRONT_REDIRECT_URI as string);
  } catch (error) {
    console.error("Error while retrieving access token from TikTok:", error);
    res.status(500).json({
      error: "Failed to obtain access token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAccessToken = async (code: string) => {
  const tokens = await getTikTokAccessToken(code);
  return tokens;
};

export const refreshAccessToken = async (
  docData: TiktokAccount,
  updateCallback: (docId: string, updates: any) => void
) => {
  let token = docData.token;
  const isTokenExpired =
    docData.expiresAt < Date.now() || docData.refreshExpiresAt < Date.now();
  if (isTokenExpired) {
    const tokens = await getTikTokAccessToken(docData.refreshToken);

    const updatedRef = await updateCallback(docData.id, {
      token: tokens.access_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      refreshToken: tokens.refresh_token,
      refreshExpiresAt: Date.now() + tokens.refresh_expires_in * 1000,
      openId: tokens.open_id,
      scope: tokens.scope,
      tokenType: tokens.token_type,
    });
    token = tokens.access_token;
  }

  return token;
};

export const getUserInfo = async (accessToken: string) => {
  const { data } = await getTikTokUserInfo(accessToken);
  return data.user;
};

export const getUserPosts = async (accessToken: string) => {
  const response = await getTikTokVideos(accessToken);
  return response.data.videos;
};

export const getUserPage = async (accessToken: string) => {
  const userInfo = await getUserInfo(accessToken);
  const posts = await getUserPosts(accessToken);
  return {
    ...userInfo,
    posts,
  };
};
