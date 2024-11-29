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

app.get("/cb/instagram", Instagram.OAuthCallback);

app.get("/cb/youtube", Youtube.OAuthCallback);

app.get("/cb/tiktok", Tiktok.OAuthCallback);

app.get("/cb/x", Twitter.OAuthCallback);

app.get("/instagram/auth", Instagram.generateAuthURL);

app.get("/youtube/auth", Youtube.generateAuthURL);

app.get("/tiktok/auth", Tiktok.generateAuthURL);

app.get("/x/auth", Twitter.generateAuthURL);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
