import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

import { client, setCachedData } from "./lib/redis";

//---------------------------------
// REST route files
//---------------------------------
import crudRoutes from "./routes/crud";
import cartRoutes from "./routes/cart";

//---------------------------------
// Oauth route files
//---------------------------------
import facebookRoutes from "./routes/oauth/facebook";
import instagramRoutes from "./routes/oauth/instagram";
import linkedinRoutes from "./routes/oauth/linkedin";
import tiktokRoutes from "./routes/oauth/tiktok";
import xRoutes from "./routes/oauth/x";
import youtubeRoutes from "./routes/oauth/youtube";

const jsonParser = bodyParser.json();
const app = express();
const PORT = 8000;

client.connect();

app.use(cookieParser());
app.use(cors());

app.get("/", async (_req, res) => {
  res.send("Hello World");
});

app.post("/cache/set", jsonParser, async (req, res) => {
  await setCachedData(req.body.key, req.body.value);
  res.send("OK");
});

app.get("/api/cron", async (_req, res) => {
  res.send("Hello World");
});

//---------------------------------
// Use route files
//---------------------------------

app.use("/", jsonParser, crudRoutes);
app.use("/", jsonParser, cartRoutes);

app.use("/", facebookRoutes);
app.use("/", instagramRoutes);
app.use("/", linkedinRoutes);
app.use("/", tiktokRoutes);
app.use("/", xRoutes);
app.use("/", youtubeRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

const shutdown = () => {
  console.log("Shutting down server...");
  client.disconnect();
};

process.on("SIGINT", shutdown); // Quand on appuie sur Ctrl+C
process.on("SIGTERM", shutdown);
