import { Request, Response } from "express";
import dotenv from "dotenv";
import {
  collection,
  addDoc,
  where,
  Timestamp,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getCachedData } from "../../lib/redis";
import { OAuthResponse, SocialAccount, UserInfo } from "../../types";

dotenv.config();

export const generateAuthURL = (req: Request, res: Response): void => {
  res.redirect(
    `https://www.facebook.com/v21.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_BASE_URI}/cb/facebook&state=${req.query.userId}&scope=public_profile,user_friends,user_videos,user_posts`
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
    console.error("Error while retrieving access token from Facebook:", error);
    res.status(500).json({
      error: "Failed to obtain access token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAccessToken = async (code: string): Promise<OAuthResponse> => {
  const url = `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_BASE_URI}/cb/facebook&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`;

  try {
    const response = await fetch(url);
    console.log("getAccessToken Response:", response);
    const shortLivedAccessTokenData = await response.json();
    console.log("Short-Lived Access Token:", shortLivedAccessTokenData);
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
  const url = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortLivedAccessToken}`;

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
        `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&fb_exchange_token=${token}`,
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
  const url = `https://graph.facebook.com/me?fields=id,name,picture.width(200).height(200),friends&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    delete data.id;
    console.log("User data:", data);
    return {
      id: data.id,
      name: data.name,
      picture: data.picture.data.url,
      friends: data.friends.summary.total_count,
    };
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

export const getUserPosts = async (
  accessToken: string
): Promise<InstagramPost[]> => {
  const url = `https://graph.facebook.com/v21.0/me/posts?fields=id,type,properties,caption,message,name,created_time,description,full_picture,permalink_url,updated_time&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    console.log("Response:", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = (await response.json()) as { data: any[] };

    return data;
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    throw error;
  }
};
