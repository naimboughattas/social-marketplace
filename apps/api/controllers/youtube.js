import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { db } from "../firebase";
const { collection, addDoc, Timestamp } = require("firebase/firestore");
const { getCachedData } = require("../redis");

// Remplace ces valeurs par celles générées dans Google Cloud Console
const CLIENT_ID =
  "193882501355-8qoiktl17j1u9kj0p85qjaejbgf423v3.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://the-reach-market-api.vercel.app/cb/youtube"; // Par exemple, 'http://localhost:3000/oauth2callback'

// Créer un client OAuth2
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Générez une URL d'autorisation pour l'utilisateur
export const generateAuthURL = async (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/youtube.readonly"]; // L'autorisation nécessaire pour accéder aux informations de chaîne
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Demander un refresh token
    scope: scopes,
    state: req.query.userId,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  res.redirect(authUrl);
};

export const OAuthCallback = async (req, res) => {
  // Après que l'utilisateur ait autorisé l'accès, récupérer le code
  // Exemple de code reçu dans l'URL : 'authorization_code_from_redirect'
  const code = req.query.code;
  const userId = req.query.state;
  console.log("Authorization code:", code);
  console.log("userId:", userId);

  // Obtenez un jeton d'accès
  const { access_token } = await getAccessToken(code);
  console.log("tokens:", access_token);
  const channels = await getUserChannels();
  console.log("User channels:", channels, "length:", channels.length);

  const channelId = channels[0].id;
  const youtube = google.youtube("v3");
  const apiKey = "AIzaSyD60OiLSXy_EWbC39NN1UtUblLaJxU_Zjs";
  const response = await youtube.channels.list({
    part: "snippet,statistics",
    id: channelId,
    key: apiKey,
  });
  const pageData = response.data.items[0].snippet;
  console.log("pageData:", pageData);
  const formData = await getCachedData(userId);
  console.log("formData:", formData);
  const accountRef = await addDoc(collection(db, "socialAccounts"), {
    userId,
    pageId: channelId,
    code,
    token: access_token,
    ...formData,
    ...pageData,
    createdAt: Timestamp.now(),
  });
  res.redirect(
    "https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts"
  );
  // res.send(response);
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
