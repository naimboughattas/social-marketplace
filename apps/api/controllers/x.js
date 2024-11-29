import { Client, auth } from "twitter-api-sdk";
import { db } from "../firebase";
const { collection, addDoc, Timestamp } = require("firebase/firestore");
const { getCachedData } = require("../redis");

export const authClient = new auth.OAuth2User({
  client_id: "bjF0anFlY1RIc2VpZDdvRTBRdjU6MTpjaQ",
  client_secret: "AF2Gru6sDAOlcJE0NTrwzvQ6W5Hr4ZyEUAKPQ1Bz24vXz-QgWr",
  callback: `https://the-reach-market-api.vercel.app/cb/x`,
  scopes: ["tweet.read", "users.read"],
});

export const client = new Client(authClient);

export const generateAuthURL = async (req, res) => {
  const authUrl = authClient.generateAuthURL({
    state: req.query.userId,
    code_challenge_method: "s256",
  });
  res.redirect(authUrl);
};

export const OAuthCallback = async (req, res) => {
  const { code, state: userId } = req.query;
  console.log("Authorization code:", code);
  console.log("User:", userId);
  // const bearerToken =
  //   "AAAAAAAAAAAAAAAAAAAAAATJxAEAAAAAY3yg8dUg8MK%2BOmmlDGWG1SdCAqc%3DChdHSn0hhcgnUg8LeEQf5ck4ty2xTBYKmixye6BdfcIK9mSBkY";
  try {
    const bearerToken = await Twitter.authClient.requestAccessToken(code);
    console.log("Token:", bearerToken);
    const pageData = await Twitter.getUserInfo();
    console.log("pageData:", pageData);
    const formData = await getCachedData(userId);
    console.log("formData:", formData);
    const accountRef = await addDoc(collection(db, "socialAccounts"), {
      userId,
      ...formData,
      ...pageData,
      createdAt: Timestamp.now(),
    });
    res.redirect(
      "https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts"
    );
  } catch (error) {
    console.error("Error while retrieving access token from Twitter:", error);
    res.status(500).json({
      error: "Failed to obtain access token",
      details: error.message,
    });
  }
};

export const getUserInfo = async () => {
  const response = await client.users.findMyUser({
    "user.fields": [
      "affiliation",
      "connection_status",
      "created_at",
      "description",
      "entities",
      "id",
      "location",
      "most_recent_tweet_id",
      "name",
      "pinned_tweet_id",
      "profile_banner_url",
      "profile_image_url",
      "protected",
      "public_metrics",
      "receives_your_dm",
      "subscription_type",
      "url",
      "username",
      "verified",
      "verified_type",
      "withheld",
    ],
  });
  console.log("profileData:", response.data);
  return response.data;
};
