import dotenv from "dotenv";
const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  Timestamp,
} = require("firebase/firestore");
const { getDatabase } = require("firebase/database");
const serviceAccount = require("../firebase-credentials.json");

dotenv.config();

export const adminFirebaseApp = admin.initializeApp({
  databaseURL:
    "https://social-marketplace-9eb85-default-rtdb.europe-west1.firebasedatabase.app/",
  credential: admin.credential.cert(serviceAccount),
});

initializeApp({
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
export const db = getFirestore();
if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "127.0.0.1", 8081);
}
