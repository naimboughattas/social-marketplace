import { Request, Response } from "express";
import dotenv from "dotenv";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getCachedData } from "../../lib/redis";
import { OAuthResponse, UserInfo } from "../../types";

dotenv.config();

export const generateAuthURL = (req: Request, res: Response): void => {
  res.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_BASE_URI}/cb/linkedin&state=${req.query.userId}&scope=openid,profile,email`
  );
};

export const OAuthCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  const code = req.query.code as string;
  const userId = req.query.state as string;

  try {
    const { access_token } = await getAccessToken(code);
    console.log("Token:", access_token);
    const formData = await getCachedData(userId);
    console.log("formData:", formData);

    const accountRef = await addDoc(collection(db, "socialAccounts"), {
      userId,
      code,
      token: access_token,
      ...formData,
      createdAt: Timestamp.now(),
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

export const getAccessToken = async (code: string): Promise<OAuthResponse> => {
  const response = await fetch(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.LINKEDIN_CLIENT_ID as string,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET as string,
        code,
        redirect_uri: `${process.env.OAUTH_REDIRECT_BASE_URI}/cb/linkedin`,
      }),
    }
  );

  const tokens = await response.json();
  console.log("tokens:", tokens);
  return tokens;
};

export const refreshAccessToken = async (
  docData: any,
  updateCallback?: (docId: string, updates: any) => void
) => docData.token;

export const getUserInfo = async (accessToken: string): Promise<UserInfo> => {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const userInfo = await response.json();
  console.log("userInfo:", userInfo);
  return userInfo;
};

export const getUserPosts = async (accessToken: string): Promise<any[]> => {
  return [];
};
