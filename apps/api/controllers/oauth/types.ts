import { BaseAccount } from "../ressources/accounts/types";

export interface FacebookAccount extends BaseAccount {
  token: string;
  expiresAt: number;
}

export interface InstagramAccount extends BaseAccount {
  token: string;
  expiresAt: number;
}

export interface LinkedinAccount extends BaseAccount {
  token: string;
  expiresAt: number;
}

export interface TiktokAccount extends BaseAccount {
  token: string;
  expiresAt: number;
  refreshToken: string;
  refreshExpiresAt: number;
}

export interface XAccount extends BaseAccount {
  token: string;
  expiresAt: number;
}

export interface YoutubeAccount extends BaseAccount {
  refreshToken: string;
  token: string;
  expiresAt: number;
  scope: string;
  tokenType: string;
}

export type Account =
  | FacebookAccount
  | InstagramAccount
  | LinkedinAccount
  | TiktokAccount
  | XAccount
  | YoutubeAccount;
