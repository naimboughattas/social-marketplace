import { Request, Response } from "express";
import dotenv from "dotenv";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { deleteCachedData, getCachedData } from "../../lib/redis";
import { YoutubeAccount } from "./types";
import { createDocument } from "../firebase";

dotenv.config();

// Initialize OAuth2 client
const oauth2Client = new OAuth2Client(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/youtube`
);

// Generate authentication URL
export const generateAuthURL = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.query.userId as string;
    const scopes = ["https://www.googleapis.com/auth/youtube.readonly"];
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: userId,
      prompt: "consent",
    });

    console.log("Auth URL generated:", authUrl);
    res.redirect(authUrl);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    res.status(500).json({ error: "Failed to generate auth URL" });
  }
};

// Handle OAuth callback and save access token
export const OAuthCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const userId = req.query.state as string;

    const tokens = await getAccessToken(code);
    const formData = await getCachedData(userId);
    await deleteCachedData(userId);
    await createDocument("accounts", {
      userId,
      token: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expiry_date,
      scope: tokens.scope,
      tokenType: tokens.token_type,
      ...formData,
    });

    res.redirect(process.env.FRONT_REDIRECT_URI as string);
  } catch (error) {
    console.error("Error during OAuth callback:", error);
    res.status(500).json({
      error: "Failed to process OAuth callback",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get access token using authorization code
const getAccessToken = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

// Refresh access token
export const refreshAccessToken = async (
  docData: YoutubeAccount,
  updateCallback?: (docId: string, updates: any) => void
) => {
  oauth2Client.setCredentials({ refresh_token: docData.refreshToken });
  const { credentials } = await oauth2Client.refreshAccessToken();

  if (updateCallback && credentials.access_token) {
    updateCallback(docData.id, {
      token: credentials.access_token,
      expiresAt: credentials.expiry_date,
    });
  }

  if (!credentials.access_token) {
    throw new Error("Access token not found in response");
  }

  // console.log("Access token refreshed:", credentials);
  return credentials.access_token;
};

// Get user YouTube channel info
export const getUserInfo = async () => {
  const youtube = google.youtube("v3");
  const response = await youtube.channels.list({
    part: ["snippet", "contentDetails", "statistics"],
    mine: true,
    auth: oauth2Client,
  });

  const channels = response.data.items || [];
  if (channels.length === 0) return null;

  const channelSnippet = channels[0].snippet;
  const channelId = channels[0].contentDetails?.relatedPlaylists?.uploads;
  const channelStatistics = channels[0].statistics;

  return {
    channelId,
    ...channelSnippet,
    ...channelStatistics,
  };
};

// Fetch user posts from YouTube
export const getUserPosts = async () => {
  const youtube = google.youtube("v3");

  const channel = await getUserInfo();
  const playlistId = channel?.channelId;

  const response = await youtube.playlistItems.list({
    part: ["snippet", "contentDetails"],
    maxResults: 10,
    playlistId,
    auth: oauth2Client,
  });

  const posts = response.data.items || [];

  return posts.map((item) => ({
    image: item.snippet?.thumbnails?.medium?.url,
    title: item.snippet?.title,
    description: item.snippet?.description,
    videoId: item.contentDetails?.videoId,
    publishedAt: item.snippet?.publishedAt,
  }));
};

export const getUserPage = async () => {
  const userInfo = await getUserInfo();
  const posts = await getUserPosts();
  return {
    ...userInfo,
    posts,
  };
};
