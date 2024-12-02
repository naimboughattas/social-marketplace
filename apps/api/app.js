const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const { setCachedData } = require("./redis");

import * as Instagram from "./controllers/instagram";
import * as Youtube from "./controllers/youtube";
import * as Twitter from "./controllers/x";
import * as Tiktok from "./controllers/tiktok";
import * as Linkedin from "./controllers/linkedin";
import * as Facebook from "./controllers/facebook";

const VERIFY_TOKEN = "ceci_est_un_test";

const jsonParser = bodyParser.json();
const app = express();
const PORT = 8000;

app.use(cookieParser());
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

app.get("/webhook/facebook", jsonParser, (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook vérifié avec succès.");
    res.status(200).send(challenge);
  } else {
    console.error("Échec de la vérification du Webhook.");
    res.sendStatus(403);
  }
});

// Réception des événements Webhook
app.post("/webhook/facebook", jsonParser, (req, res) => {
  const body = req.body;

  if (body.object === "user") {
    body.entry.forEach((entry) => {
      const changes = entry.changes;
      console.log("Changements détectés :", changes);

      // Traiter les changements ici (par ex. posts, amis, vidéos, etc.)
    });
    res.sendStatus(200); // Confirmer la réception
  } else {
    res.sendStatus(404);
  }
});

app.get("/cb/instagram", Instagram.OAuthCallback);

app.get("/cb/youtube", Youtube.OAuthCallback);

app.get("/cb/tiktok", Tiktok.OAuthCallback);

app.get("/cb/x", Twitter.OAuthCallback);

app.get("/cb/linkedin", Linkedin.OAuthCallback);

app.get("/cb/facebook", Facebook.OAuthCallback);

app.get("/instagram/auth", Instagram.generateAuthURL);

app.get("/youtube/auth", Youtube.generateAuthURL);

app.get("/tiktok/auth", Tiktok.generateAuthURL);

app.get("/x/auth", Twitter.generateAuthURL);

app.get("/linkedin/auth", Linkedin.generateAuthURL);

app.get("/facebook/auth", Facebook.generateAuthURL);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
