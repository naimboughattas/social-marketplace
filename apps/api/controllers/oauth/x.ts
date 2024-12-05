import { Request, Response } from "express";
import dotenv from "dotenv";
import { Client, auth } from "twitter-api-sdk";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getCachedData } from "../../lib/redis";

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

export const OAuthCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, state: userId } = req.query;
  console.log("Authorization code:", code);
  console.log("User:", userId);

  try {
    const {
      token: { access_token, expires_at, scope, token_type },
    } = await authClient.requestAccessToken(code as string);
    console.log("Token:", { access_token, expires_at, scope, token_type });
    const formData = await getCachedData(userId as string);
    console.log("formData:", formData);

    const accountRef = await addDoc(collection(db, "socialAccounts"), {
      userId,
      token: access_token,
      expiresAt: Date.now() + expires_at * 1000,
      scope,
      tokenType: token_type,
      ...formData,
      createdAt: Timestamp.now(),
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
  docData: any,
  updateCallback?: (docId: string, updates: any) => void
) => docData.token;

export const getUserInfo = async (accessToken: string) => {
  console.log("Fetching user info...");

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
  console.log("Fetching done...");
  const data = { ...response.data, pageId: response.data.id };
  delete data.id;
  console.log("profileData:", data);
  return data;
};

export const getUserPosts = async (
  accessToken: string,
  userId: string
): Promise<any[]> => {
  try {
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
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    throw error;
  }
};

export const getUserPage = async (accessToken: string): Promise<any[]> => {
  try {
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
    const userInfoResponse = await client.users.findMyUser({
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
    // const userPostsResponse = await client.tweets.usersIdTweets(
    //   userInfoResponse.data?.id as string,
    //   {
    //     max_results: 10, // Limiter à 10 tweets
    //     "tweet.fields": ["created_at", "text"], // Champs supplémentaires
    //   }
    // );
    return {
      ...userInfoResponse.data,
      // posts: [userPostsResponse.data],
      posts: [],
    };
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    throw error;
  }
};
