const http = require("http");
const express = require("express");
const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getFirestore, addDoc, collection } = require("firebase/firestore");
const { getDatabase } = require("firebase/database");
const serviceAccount = require("./firebase-credentials.json");

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

app.get("/", (req, res) => {
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
  console.log("Instagram code received:", code);

  const clientId = "1617513219147291";
  const clientSecret = "3c5ff784e66d4de157b09b5a43cb64c2";
  const redirectUri = "https://the-reach-market-api.vercel.app/cb/instagram"; // Redirection après l'authentification Instagram

  try {
    // Requête pour échanger le code d'autorisation contre un access token
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

    // Vérification de la réponse
    if (!response.ok) {
      console.error("Failed to exchange code for token", response.statusText);
      return res.status(400).send(response);
    }

    // Récupération des données (access token) renvoyées par Instagram
    const data = await response.json();
    console.log("Access token data:", data);

    // Sauvegarde de l'access token dans Firebase
    const userId = data.user_id; // Assure-toi de récupérer l'ID utilisateur unique d'Instagram
    const accountRef = await addDoc(collection(db, "test"), {
      access_token: data.access_token,
      user_id: userId,
    });
    console.log("Access token saved to Firebase");

    // Répondre à l'utilisateur
    res.status(200).send("OK");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
