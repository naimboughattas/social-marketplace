const http = require("http");
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
} = require("firebase/firestore");
const { getDatabase } = require("firebase/database");
const serviceAccount = require("./firebase-credentials.json");

const testToken =
  "IGQWRPcnNLeVl0RTRvbWl6SFhadXdXbmJ2THNzdVFqdkp1M0NzOEJfRGVJSE5jNFNLNlpkN0E5dFhUZAFlFRFlYMS1ESUUzNjV4ZADdRWlRFcGJjdUt6M3dBSXIybWhHdk11VUJCUmc1cWhjVFR5WVJDQ05meHdhWmMZD";

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

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.get("/about", (req, res) => {
  res.send("About route 🎉 ");
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
  const { code } = req.query; // Récupère le code envoyé par Instagram après la validation

  const q = query(
    collection(db, "socialAccounts"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);
  const accounts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const accountByCode = accounts.find((account) => account.code === code);
  if (accountByCode)
    res.redirect("https://the-reach-market.vercel.app/dashboard/my-accounts");

  const clientId = "1617513219147291";
  const clientSecret = "3c5ff784e66d4de157b09b5a43cb64c2";
  const redirectUri =
    "https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts"; // Redirection après l'authentification Instagram

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
    const data = await response.json();
    res.redirect(
      `https://the-reach-market.vercel.app/dashboard/my-accounts?token=${data.access_token}`
    );
  } catch (error) {
    throw new Error("Failed to exchange code for token", error);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
