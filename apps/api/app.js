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

app.get("/cb/linkedin", (req, res) => {
  console.log("LinkedIn callback:", req.query);
  res.send("OK");
});

app.get("/cb/facebook", (req, res) => {
  console.log("LinkedIn callback:", req.query);
  res.send("OK");
});

app.get("/instagram/auth", Instagram.generateAuthURL);

app.get("/youtube/auth", Youtube.generateAuthURL);

app.get("/tiktok/auth", Tiktok.generateAuthURL);

app.get("/x/auth", Twitter.generateAuthURL);

app.get("/linkedin/auth", (req, res) => {
  const CLIENT_ID = "780d3m61bi94hx";
  const REDIRECT_URI = "https://the-reach-market-api.vercel.app/cb/linkedin";
  res.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${req.query.userId}&scope=r_liteprofile,r_basicprofile`
  );
});

app.get("/facebook/auth", (req, res) => {
  const CLIENT_ID = "780d3m61bi94hx";
  const REDIRECT_URI = "https://the-reach-market-api.vercel.app/cb/linkedin";
  res.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=foobar&scope=liteprofile%20emailaddress%20w_member_social`
  );
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
