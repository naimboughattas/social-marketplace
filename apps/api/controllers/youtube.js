import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

// Remplace ces valeurs par celles générées dans Google Cloud Console
const CLIENT_ID = "193882501355-8qoiktl17j1u9kj0p85qjaejbgf423v3.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://the-reach-market-api.vercel.app/cb/youtube"; // Par exemple, 'http://localhost:3000/oauth2callback'

// Créer un client OAuth2
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Générez une URL d'autorisation pour l'utilisateur
export const getAuthUrl = (userId) => {
  const scopes = ["https://www.googleapis.com/auth/youtube.readonly"]; // L'autorisation nécessaire pour accéder aux informations de chaîne
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Demander un refresh token
    scope: scopes,
    state: userId,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  return authUrl;
};

// Récupérer le jeton d'accès après que l'utilisateur ait autorisé l'accès
export const getAccessToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  console.log("Access token retrieved:", tokens);
  return tokens;
};

// Utiliser le jeton d'accès pour récupérer les chaînes de l'utilisateur
export const getUserChannels = async () => {
  const youtube = google.youtube("v3");

  const response = await youtube.channels.list({
    part: "snippet,contentDetails",
    mine: true, // Pour récupérer les chaînes de l'utilisateur authentifié
    auth: oauth2Client,
  });

  console.log("User channels:", response.data.items);
  return response.data.items;
};

