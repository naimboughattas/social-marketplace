import { Request, Response } from "express";
import dotenv from "dotenv";
import { deleteCachedData, getCachedData } from "../../lib/redis";
import { LinkedinAccount } from "./types";
import { createDocument } from "../firebase";
import {
  getLinkedInAccessToken,
  getLinkedInUserProfile,
} from "../../lib/linkedin";

dotenv.config();

export const generateAuthURL = (req: Request, res: Response) => {
  res.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_BASE_URI}/cb/linkedin&state=${req.query.userId}&scope=openid,profile,email`
  );
};

export const OAuthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const userId = req.query.state as string;

  try {
    const { access_token } = await getAccessToken(code);
    const formData = await getCachedData(userId);
    await deleteCachedData(userId);
    await createDocument("accounts", {
      userId,
      code,
      token: access_token,
      ...formData,
    });

    res.redirect(process.env.FRONT_REDIRECT_URI as string);
  } catch (error) {
    console.error("Error while retrieving access token from LinkedIn:", error);
    res.status(500).json({
      error: "Failed to obtain access token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAccessToken = async (code: string) => {
  const tokens = await getLinkedInAccessToken(code);
  return tokens;
};

export const refreshAccessToken = async (
  docData: LinkedinAccount,
  updateCallback?: (docId: string, updates: any) => void
) => docData.token;

export const getUserInfo = async (accessToken: string) => {
  const profile = await getLinkedInUserProfile(accessToken);
  return profile;
};

export const getUserPosts = async (accessToken: string) => {
  return [];
};

export const getUserPage = async (accessToken: string) => {
  const userInfo = await getUserInfo(accessToken);
  const posts = await getUserPosts(accessToken);
  return {
    ...userInfo,
    posts,
  };
};
