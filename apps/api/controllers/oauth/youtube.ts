import { Request, Response } from "express";
import dotenv from "dotenv";
import { google } from "googleapis";
import { Credentials, OAuth2Client } from "google-auth-library";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getCachedData } from "../../lib/redis";

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
export const OAuthCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const code = req.query.code as string;
    const userId = req.query.state as string;

    // console.log("Authorization code received:", code);
    // console.log("User ID:", userId);

    const tokens = await getAccessToken(code);
    // console.log("Tokens retrieved:", tokens);

    const formData = await getCachedData(userId);
    // console.log("Form data from cache:", formData);

    await saveAccountData(userId, tokens, formData);

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

// Save user account data to Firestore
const saveAccountData = async (
  userId: string,
  tokens: Credentials,
  formData: any
) => {
  // console.log("Saving account data to Firestore...", tokens);
  await addDoc(collection(db, "socialAccounts"), {
    userId,
    token: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: tokens.expiry_date,
    scope: tokens.scope,
    tokenType: tokens.token_type,
    ...formData,
    createdAt: Timestamp.now(),
  });
};

// Refresh access token
export const refreshAccessToken = async (
  docData: { id: string; token: string; refreshToken: string },
  updateCallback?: (docId: string, updates: any) => void
) => {
  try {
    oauth2Client.setCredentials({ refresh_token: docData.refreshToken });
    const { credentials } = await oauth2Client.refreshAccessToken();

    if (updateCallback && credentials.access_token) {
      updateCallback(docData.id, {
        token: credentials.access_token,
        expiresAt: credentials.expiry_date,
      });
    }

    // console.log("Access token refreshed:", credentials);
    return credentials.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

// Get user YouTube channel info
export const getUserInfo = async () => {
  try {
    const youtube = google.youtube("v3");
    const response = await youtube.channels.list({
      part: ["snippet", "contentDetails"],
      mine: true,
      auth: oauth2Client,
    });

    const channels = response.data.items || [];
    if (channels.length === 0) return null;

    const channelInfo = channels[0].snippet;
    // console.log("User channel info:", channels[0]);

    return channelInfo;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

// Fetch user posts from YouTube
export const getUserPosts = async () => {
  try {
    const youtube = google.youtube("v3");
    // get playlist ID from YouTube Studio
    const playlistResponse = await youtube.playlists.list({
      part: ["snippet"],
      mine: true,
      auth: oauth2Client,
    });

    const playlists = playlistResponse.data.items || [];
    if (playlists.length === 0) return [];

    const playlistId = playlists[0].id;
    if (!playlistId) return [];

    const response = await youtube.playlistItems.list({
      part: ["snippet", "contentDetails"],
      maxResults: 10,
      playlistId: "UUoKda3nLvQO0lpNOeJRHlkQ", // Replace with the correct playlist ID
      auth: oauth2Client,
    });

    const posts = response.data.items || [];
    // console.log("User posts:", posts);

    return posts.map((item) => ({
      title: item.snippet?.title,
      description: item.snippet?.description,
      videoId: item.contentDetails?.videoId,
      publishedAt: item.snippet?.publishedAt,
    }));
    return [];
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};
