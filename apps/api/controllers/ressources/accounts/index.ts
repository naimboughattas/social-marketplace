import dotenv from "dotenv";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../../firebase";

import * as Facebook from "../../oauth/facebook";
import * as Instagram from "../../oauth/instagram";
import * as Linkedin from "../../oauth/linkedin";
import * as Tiktok from "../../oauth/tiktok";
import * as X from "../../oauth/x";
import * as Youtube from "../../oauth/youtube";
import { setCachedData } from "../../../lib/redis";
import {
  Account,
  FacebookAccount,
  InstagramAccount,
  LinkedinAccount,
  TiktokAccount,
  XAccount,
  YoutubeAccount,
} from "../../oauth/types";

dotenv.config();

const providers = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  tiktok: Tiktok,
  x: X,
  youtube: Youtube,
};

// Récupérer un account par ID
export const getById = async (accountId: string) => {
  const baseAccountData = await getDocumentById<Account>("accounts", accountId);
  const token = await getAccountByPlatform(baseAccountData, accountId);
  const [pageData] = await Promise.all([
    providers[baseAccountData.platform].getUserPage(token),
  ]);

  const account = {
    ...baseAccountData,
    ...pageData,
  };

  await setCachedData(baseAccountData.id, {
    data: account,
    expiresAt: Date.now() + 3600 * 1000, // 1 hour
  });
  // Retourner les données du document
  return account;
};

// Récupérer tous les accounts avec des filtres optionnels
export const getAll = async (filters: any[]) => {
  return await getDocuments("accounts", filters);
};

// Mettre à jour un account
export const update = async (accountId: string, updates: any) => {
  return await updateDocument("accounts", accountId, updates);
};

// Supprimer un account (soft delete)
export const remove = async (accountId: string) => {
  return await deleteDocument("accounts", accountId);
};

const getAccountByPlatform = async (data: Account, accountId: string) => {
  let token;
  switch (data.platform) {
    case "facebook":
      token = await providers[data.platform].refreshAccessToken(
        data as FacebookAccount,
        update
      );
      break;
    case "instagram":
      token = await providers[data.platform].refreshAccessToken(
        data as InstagramAccount,
        update
      );
      break;
    case "linkedin":
      token = await providers[data.platform].refreshAccessToken(
        data as LinkedinAccount,
        update
      );
      break;
    case "tiktok":
      token = await providers[data.platform].refreshAccessToken(
        data as TiktokAccount,
        update
      );
      break;
    case "x":
      token = await providers[data.platform].refreshAccessToken(
        data as XAccount,
        update
      );
      break;
    case "youtube":
      token = await providers[data.platform].refreshAccessToken(
        data as YoutubeAccount,
        update
      );
      break;
    default:
      throw new Error("Invalid platform");
  }
  return token;
};
