import { Request, Response } from "express";
import dotenv from "dotenv";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getCachedData } from "../../lib/redis";

dotenv.config();

const REDIRECT_URI = `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/tiktok`;

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

    console.log("Access Token:", access_token);
    console.log("Open ID:", open_id);
    console.log("Expires in:", expires_in, "seconds");
    console.log("Refresh Token:", refresh_token);
    console.log("Refresh Expires in:", refresh_expires_in, "seconds");
    console.log("Token Type:", token_type);

    const formData = await getCachedData(userId);
    console.log("formData:", formData);

    const accountRef = await addDoc(collection(db, "socialAccounts"), {
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
      createdAt: Timestamp.now(),
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

export const getAccessToken = async (code: string): Promise<OAuthResponse> => {
  try {
    const response = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_key: process.env.TIKTOK_CLIENT_KEY as string,
          client_secret: process.env.TIKTOK_CLIENT_SECRET as string,
          code,
          grant_type: "authorization_code",
          redirect_uri: `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/tiktok`,
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

export const refreshAccessToken = async (
  docData: any,
  updateCallback: (docId: string, updates: any) => void
) => {
  try {
    let token = docData.token;
    const isTokenExpired =
      docData.expiresAt < Date.now() || docData.refreshExpiresAt < Date.now();
    console.log("Is Token Expired:", isTokenExpired);
    if (isTokenExpired) {
      // Récupérer un nouveau token
      const response = await fetch(
        "https://open.tiktokapis.com/v2/oauth/token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_key: process.env.TIKTOK_CLIENT_KEY as string,
            client_secret: process.env.TIKTOK_CLIENT_SECRET as string,
            grant_type: "refresh_token",
            refresh_token: docData.refreshToken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to refresh token: ${response.status} ${response.statusText}`
        );
      }

      const {
        open_id,
        scope,
        access_token,
        expires_in,
        refresh_token,
        refresh_expires_in,
        token_type,
      } = await response.json();

      const updatedRef = await updateCallback(docData.id, {
        token: access_token,
        expiresAt: Date.now() + expires_in * 1000,
        refreshToken: refresh_token,
        refreshExpiresAt: Date.now() + refresh_expires_in * 1000,
        openId: open_id,
        scope,
        tokenType: token_type,
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

export const getUserInfo = async (accessToken: string): Promise<any> => {
  try {
    const userInfoResponse = await fetch(
      `https://open.tiktokapis.com/v2/user/info/?fields=is_verified,open_id,union_id,avatar_url,username,follower_count,following_count,likes_count,video_count`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      throw new Error("Failed to retrieve user info from TikTok");
    }

    const { data } = await userInfoResponse.json();
    delete data.id;
    console.log("User data:", data);
    return data.user;
  } catch (error) {
    console.error("Error during request:", error);
    throw error;
  }
};

export const getUserPosts = async (accessToken: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://open.tiktokapis.com/v2/video/list/?fields=cover_image_url,id,title`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          cursor: 0,
          max_count: 10,
        }),
      }
    );
    console.log("Response:", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = (await response.json()) as { data: any[] };
    console.log("getUserPosts:", data);
    return data.videos;
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    throw error;
  }
};
