import dotenv from "dotenv";
import {
  type FacebookAccessTokenResponse,
  type FacebookUserResponse,
  type FacebookPostsResponse,
  isFacebookAccessTokenResponse,
  isFacebookUserResponse,
  isFacebookPostsResponse,
} from "./types";

dotenv.config();

export const refreshFacebookAccessToken = async (
  token: string
): Promise<FacebookAccessTokenResponse> => {
  const url = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&fb_exchange_token=${token}`;
  const response = await fetch(url);
  const data: unknown = await response.json();

  // Vérification que les données sont du bon type
  if (isFacebookAccessTokenResponse(data)) {
    return data;
  } else {
    throw new Error("Invalid response structure");
  }
};

export const getFacebookAccessToken = async (
  code: string
): Promise<FacebookAccessTokenResponse> => {
  const url = `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.OAUTH_REDIRECT_BASE_URI}/cb/facebook&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`;
  const response = await fetch(url);
  const data: unknown = await response.json();

  // Vérification que les données sont du bon type
  if (isFacebookAccessTokenResponse(data)) {
    return data;
  } else {
    throw new Error("Invalid response structure");
  }
};

export const getFacebookUserData = async (
  accessToken: string
): Promise<FacebookUserResponse> => {
  const url = `https://graph.facebook.com/me?fields=id,name,picture.width(200).height(200),friends&access_token=${accessToken}`;
  const response = await fetch(url);
  const userData: unknown = await response.json();
  console.log("Facebook User Profile:", userData);

  // Vérification de la structure des données avec un type guard
  if (isFacebookUserResponse(userData)) {
    return userData;
  } else {
    throw new Error("Invalid user data structure");
  }
};

export const getFacebookUserPosts = async (
  accessToken: string
): Promise<FacebookPostsResponse> => {
  const url = `https://graph.facebook.com/v21.0/me/posts?fields=id,type,properties,caption,message,name,created_time,description,full_picture,permalink_url,updated_time&access_token=${accessToken}`;
  const response = await fetch(url);
  const postsData = (await response.json()) as FacebookPostsResponse;
  return postsData;
};
