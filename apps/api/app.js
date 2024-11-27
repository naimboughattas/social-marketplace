const http = require("http");
const express = require("express");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://social-marketplace-9eb85-default-rtdb.europe-west1.firebasedatabase.app/",
});

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

app.get("/cb/instagram", (req, res) => {
  // Instagram callback from instagram oauth login flow
  console.log("Instagram callback received:", req.query);
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
