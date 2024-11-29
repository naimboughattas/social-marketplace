const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  Timestamp,
} = require("firebase/firestore");
const { getDatabase } = require("firebase/database");
const serviceAccount = require("./firebase-credentials.json");
const { getCachedData, setCachedData } = require("./redis");
const {
  getLongLivedToken,
  getInstagramBusinessAccountId,
  getInstagramProfileData,
  getAccessToken,
  getInstagramUserInfo,
} = require("./controllers/instagram");

import { google } from "googleapis";
import {
  getAuthUrl,
  getAccessToken as getYoutubeAccessToken,
  getUserChannels,
} from "./controllers/youtube";
import { getTwitterData, getTwitterUserInfo } from "./controllers/x";

const testToken =
  "IGQWRPcnNLeVl0RTRvbWl6SFhadXdXbmJ2THNzdVFqdkp1M0NzOEJfRGVJSE5jNFNLNlpkN0E5dFhUZAFlFRFlYMS1ESUUzNjV4ZADdRWlRFcGJjdUt6M3dBSXIybWhHdk11VUJCUmc1cWhjVFR5WVJDQ05meHdhWmMZD";

const jsonParser = bodyParser.json();
admin.initializeApp({
  databaseURL:
    "https://social-marketplace-9eb85-default-rtdb.europe-west1.firebasedatabase.app/",
  credential: admin.credential.cert(serviceAccount),
});

const firestoreApp = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  databaseURL:
    "https://social-marketplace-9eb85-default-rtdb.europe-west1.firebasedatabase.app/",
  appId: process.env.VITE_FIREBASE_APP_ID,
});

// Obtention de la référence à la base de données
const db = getFirestore(firestoreApp);
const app = express();
const PORT = 8000;

// Configuration des sessions
app.use(
  session({
    secret: "votreSecret",
    resave: false,
    saveUninitialized: true,
    store: new (require("session-file-store")(session))(),
  })
);
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.post("/cache/set", jsonParser, async (req, res) => {
  console.log("Setting cache:", req.body.key, req.body.value);
  await setCachedData(req.body.key, req.body.value);
  res.send("OK");
});

app.get("/webhook/instagram", (req, res) => {
  console.log("Webhook received:", req.body);
  const db = admin.database();
  const ref = db.ref("posts");
  ref.push({
    content: "New post content",
    timestamp: Date.now(),
  });
  res.status(200).send("OK");
});

app.get("/cb/instagram", async (req, res) => {
  const { code, state: userId } = req.query; // Récupère le code envoyé par Instagram après la validation
  console.log("state:", userId, "code:", code);

  const q = query(collection(db, "socialAccounts"), where("code", "==", code));

  const snapshot = await getDocs(q);
  const accounts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const accountByCode = accounts.find((account) => account.code === code);
  if (accountByCode) {
    res.redirect(
      "https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts"
    );
  }

  try {
    const { access_token, user_id } = await getAccessToken(code);
    // const shortLivedToken = "IGQWROeUt1ZA3lvU2p2SW1MeW10Qk90S1RLS2JGc2p1UndJeXlZAcUY4dkpKWGJBMVVKNVZAWeEx1OW10NU1BVFNod01hUlZAqNEpyY3ZAXYVpUejJRMkM0X3MxbWZAWYkJYVFV2Sk0tS0luQW10Y2xJVW1ITlFVTXFYUTdzMTVZAS2J2eUgwd0kZD";
    console.log("short lived token:", access_token);

    const pageData = await getInstagramUserInfo(access_token);
    const formData = await getCachedData(userId);
    console.log("formData:", formData);
    const accountRef = await addDoc(collection(db, "socialAccounts"), {
      userId,
      pageId: user_id,
      code,
      token: access_token,
      ...formData,
      ...pageData,
      createdAt: Timestamp.now(),
    });
    res.redirect(
      "https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts"
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to exchange code for token", error);
  }
});

app.get("/cb/youtube", async (req, res) => {
  // Après que l'utilisateur ait autorisé l'accès, récupérer le code
  // Exemple de code reçu dans l'URL : 'authorization_code_from_redirect'
  const code = req.query.code;
  const userId = req.query.state;
  console.log("Authorization code:", code);
  console.log("userId:", userId);

  // Obtenez un jeton d'accès
  const { access_token } = await getYoutubeAccessToken(code);
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
});

app.get("/cb/tiktok", async (req, res) => {
  const code = req.query.code; // Code d'autorisation reçu après l'authentification
  const userId = req.query.state; // userId passé dans le paramètre 'state'

  console.log("Authorization code:", code);
  console.log("userId:", userId);

  try {
    // Étape 2 : Effectuer une requête POST pour obtenir le token d'accès avec fetch
    const response = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Type de contenu pour les données POST
        },
        body: new URLSearchParams({
          client_key: "sbaw0c0ngctkgyhbr1", // Ton Client ID TikTok
          client_secret: "6CEa2bQJur3FUlkXEUN5WDTRCzXMadoa", // Ton Client Secret TikTok
          code, // Le code d'autorisation reçu
          grant_type: "authorization_code", // Type de demande : code d'autorisation
          redirect_uri: "https://the-reach-market-api.vercel.app/cb/tiktok", // L'URL de redirection
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to retrieve access token");
    }

    // Si la réponse est OK, on récupère les données
    const data = await response.json();

    // Le token d'accès et d'autres informations se trouvent dans la réponse
    const { access_token, open_id } = data;

    console.log("Access Token:", access_token);
    console.log("Open ID:", open_id);

    // Étape 2 : Utiliser le access_token pour récupérer les informations du profil TikTok
    const userInfoResponse = await fetch(
      `https://open.tiktokapis.com/v2/user/info/?fields=is_verified,open_id,union_id,avatar_url,username,follower_count,following_count,likes_count,video_count`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`, // On passe le token dans l'en-tête Authorization
        },
      }
    );
    console.log("userInfoResponse:", userInfoResponse);

    if (!userInfoResponse.ok) {
      throw new Error("Failed to retrieve user info from TikTok");
    }

    // Si la réponse est OK, on récupère les données du profil
    const userInfoData = await userInfoResponse.json();

    console.log("User Info:", userInfoData);

    // Associer le token d'accès et d'autres données avec ton utilisateur
    // Par exemple, tu peux enregistrer ce token dans ta base de données avec l'userId
    // Exemple : Enregistrer le token dans une base de données associée à userId
    const formData = await getCachedData(userId);
    console.log("formData:", formData);
    const accountRef = await addDoc(collection(db, "socialAccounts"), {
      userId,
      code,
      token: access_token,
      ...formData,
      ...userInfoData.data.user,
      createdAt: Timestamp.now(),
    });
    res.redirect(
      "https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts"
    );
  } catch (error) {
    console.error("Error while retrieving access token from TikTok:", error);
    res.status(500).json({
      error: "Failed to obtain access token",
      details: error.message,
    });
  }
});

app.get(
  "/cb/x",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  async (req, res) => {
    const userId = req.query.userId;
    const bearerToken =
      "AAAAAAAAAAAAAAAAAAAAAATJxAEAAAAAY3yg8dUg8MK%2BOmmlDGWG1SdCAqc%3DChdHSn0hhcgnUg8LeEQf5ck4ty2xTBYKmixye6BdfcIK9mSBkY";
    try {
      const data = await getTwitterUserInfo("elonmusk", bearerToken);
      const formData = await getCachedData(userId);
      console.log("formData:", formData);
      const accountRef = await addDoc(collection(db, "socialAccounts"), {
        userId,
        ...formData,
        ...pageData,
        createdAt: Timestamp.now(),
      });
      res.redirect(
        "https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts"
      );
      res.json(data);
    } catch (error) {
      console.error("Error while retrieving access token from Twitter:", error);
      res.status(500).json({
        error: "Failed to obtain access token",
        details: error.message,
      });
    }
  }
);

app.get("/youtube/auth", async (req, res) => {
  const userId = req.query.userId;
  // Exemple d'utilisation
  const url = await getAuthUrl(userId); // Affiche l'URL d'autorisation

  res.redirect(url);
});

app.get("/tiktok/auth", (req, res) => {
  console.log(req.query.userId);
  const CLIENT_KEY = "sbaw0c0ngctkgyhbr1";
  const csrfState = Math.random().toString(36).substring(2);
  res.cookie("csrfState", csrfState, { maxAge: 60000 });

  let url = "https://www.tiktok.com/v2/auth/authorize/";

  // the following params need to be in `application/x-www-form-urlencoded` format.
  url += `?client_key=${CLIENT_KEY}`;
  url += "&scope=user.info.basic,user.info.profile,user.info.stats";
  url += "&response_type=code";
  url += "&redirect_uri=https://the-reach-market-api.vercel.app/cb/tiktok";
  url += `&state=${req.query.userId}`;

  res.redirect(url);
});

app.get("/x/auth", passport.authenticate("twitter"));

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
