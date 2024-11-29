import { db } from "../firebase";
const { collection, addDoc, Timestamp } = require("firebase/firestore");
const { getCachedData } = require("../redis");

const CLIENT_ID = "780d3m61bi94hx";
const CLIENT_SECRET = "WPL_AP1.TgARA6RNgPla8T4z.vwO3/A==";

export const generateAuthURL = (req, res) => {
  const REDIRECT_URI = "https://the-reach-market-api.vercel.app/cb/linkedin";
  res.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${req.query.userId}&scope=openid,profile,email`
  );
};

export const OAuthCallback = async (req, res) => {
  const code = req.query.code; // Code d'autorisation reçu après l'authentification
  const userId = req.query.state; // userId passé dans le paramètre 'state'
  try {
    const { access_token } = await getAccessToken(code);
    console.log("Token:", access_token);
    const pageData = await getUserInfo(access_token);
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

export const getAccessToken = async (code) => {
  const response = await fetch(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: "https://the-reach-market-api.vercel.app/cb/linkedin",
      }),
    }
  );
  const tokens = await response.json();
  console.log("tokens:", tokens);
  return tokens;
};

export const getUserInfo = async (accessToken) => {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const userInfo = await response.json();
  console.log("userInfo:", userInfo);
  return userInfo;
};
