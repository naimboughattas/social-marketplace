const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
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

app.use(cors());

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
  console.log("state:", userId);

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

  const clientId = "1617513219147291";
  const clientSecret = "3c5ff784e66d4de157b09b5a43cb64c2";
  const redirectUri = "https://the-reach-market-api.vercel.app/cb/instagram"; // Redirection après l'authentification Instagram

  try {
    const response = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Form URL Encoded
        },
      }
    );
    const { access_token, user_id } = await response.json();
    console.log("access_token:", access_token);
    // Étape 1 : Récupérer l'ID du compte Instagram Business
    const pageResponse = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=instagram_business_account&access_token=${access_token}`
    );
    const pageData = await pageResponse.json();
    console.log("pageData:", pageData);
    const igBusinessAccountId =
      pageData.data[0]?.instagram_business_account?.id;

    if (!igBusinessAccountId) {
      throw new Error("Aucun compte Instagram Business trouvé.");
    }

    // Étape 2 : Récupérer les informations du compte Instagram Business
    const igResponse = await fetch(
      `https://graph.facebook.com/v21.0/${igBusinessAccountId}?fields=id,ig_id,name,username,followers_count,follows_count,media_count,profile_picture_url`
    );
    const igData = await igResponse.json();
    const formData = await getCachedData(userId);
    console.log("formData:", formData);
    const accountRef = await addDoc(collection(db, "socialAccounts"), {
      userId,
      pageId: user_id,
      code,
      token: access_token,
      ...formData,
      ...igData,
      createdAt: Timestamp.now(),
    });
    res.redirect(
      "https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts"
    );
    // res.redirect(
    //   `https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts?code=${code}&token=${data.access_token}&user_id=${data.user_id}`
    // );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to exchange code for token", error);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
