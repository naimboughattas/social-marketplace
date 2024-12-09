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

const whitelist = ["http://localhost:5173", "http://localhost:5174"];
const jsonParser = bodyParser.json();
const app = express();
const PORT = 8000;

app.use(cookieParser());
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (origin && whitelist.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   })
// );

app.use(cors());

app.get("/", async (_req, res) => {
  res.send("Hello World");
});

app.post("/cache/set", jsonParser, async (req, res) => {
  console.log("Setting cache:", req.body.key, req.body.value);
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
  client.connect();
  console.log(`✅ Server is running on port ${PORT}`);
});
