import { Request, Response } from "express";
import dotenv from "dotenv";
import { Client, auth } from "twitter-api-sdk";
import { deleteCachedData, getCachedData } from "../../lib/redis";
import { XAccount } from "./types";
import { createDocument } from "../firebase";

dotenv.config();

export const authClient = new auth.OAuth2User({
  client_id: process.env.X_CLIENT_ID as string,
  client_secret: process.env.X_CLIENT_SECRET as string,
  callback: `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/x`,
  scopes: ["tweet.read", "users.read"],
});

export const generateAuthURL = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authUrl = authClient.generateAuthURL({
    state: req.query.userId as string,
    code_challenge_method: "s256",
  });
  res.redirect(authUrl);
};

export const OAuthCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const userId = req.query.state as string;

  try {
    const {
      token: { access_token, expires_at, scope, token_type },
    } = await authClient.requestAccessToken(code);
    const formData = await getCachedData(userId);
    await deleteCachedData(userId);
    await createDocument("accounts", {
      userId,
      token: access_token,
      ...(expires_at && { expiresAt: Date.now() + expires_at * 1000 }),
      scope,
      tokenType: token_type,
      ...formData,
    });

    res.redirect(process.env.FRONT_REDIRECT_URI as string);
  } catch (error) {
    console.error("Error while retrieving access token from Twitter:", error);
    res.status(500).json({
      error: "Failed to obtain access token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const refreshAccessToken = async (
  docData: XAccount,
  updateCallback?: (docId: string, updates: any) => void
) => docData.token;

export const getUserInfo = async (accessToken: string) => {
  const client = new Client(
    new auth.OAuth2User({
      client_id: process.env.X_CLIENT_ID as string,
      client_secret: process.env.X_CLIENT_SECRET as string,
      callback: `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/x`,
      scopes: ["tweet.read", "users.read"],
      token: {
        token_type: "bearer",
        access_token: accessToken,
        scope: "users.read tweet.read",
        expires_at: 1735026304503962,
      },
    })
  );
  const response = await client.users.findMyUser({
    "user.fields": [
      "id",
      "created_at",
      "description",
      "entities",
      "location",
      "name",
      "pinned_tweet_id",
      "profile_image_url",
      "protected",
      "public_metrics",
      "url",
      "username",
      "verified",
      "withheld",
    ],
  });
  const data = { ...response.data, pageId: response.data?.id };
  delete data.id;
  return data;
};

export const getUserPosts = async (accessToken: string, userId: string) => {
  const client = new Client(
    new auth.OAuth2User({
      client_id: process.env.X_CLIENT_ID as string,
      client_secret: process.env.X_CLIENT_SECRET as string,
      callback: `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/x`,
      scopes: ["tweet.read", "users.read"],
      token: {
        token_type: "bearer",
        access_token: accessToken,
        scope: "users.read tweet.read",
        expires_at: 1735026304503962,
      },
    })
  );
  const response = await client.tweets.usersIdTweets(userId, {
    max_results: 10, // Limiter à 10 tweets
    "tweet.fields": ["created_at", "text"], // Champs supplémentaires
  });
  return response.data;
};

export const getUserPage = async (accessToken: string) => {
  const client = new Client(
    new auth.OAuth2User({
      client_id: process.env.X_CLIENT_ID as string,
      client_secret: process.env.X_CLIENT_SECRET as string,
      callback: `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/x`,
      scopes: ["tweet.read", "users.read"],
      token: {
        token_type: "bearer",
        access_token: accessToken,
        scope: "users.read tweet.read",
        expires_at: 1735026304503962,
      },
    })
  );
  const userInfo = await getUserInfo(accessToken);
  if (userInfo.pageId === undefined)
    return {
      ...userInfo,
      posts: [],
    };
  const posts = await getUserPosts(accessToken, userInfo.pageId);

  return {
    ...userInfo,
    posts,
  };
};
