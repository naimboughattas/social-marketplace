import { db } from "../firebase";
const { collection, addDoc, Timestamp } = require("firebase/firestore");
const { getCachedData } = require("../redis");

const CLIENT_ID = "587515137267947";
const CLIENT_SECRET = "3d065405e44b5763266ee21de24d8f1c";
const REDIRECT_URI = "https://the-reach-market-api.vercel.app/cb/facebook";

export const generateAuthURL = (req, res) => {
  res.redirect(
    `https://www.facebook.com/v21.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${req.query.userId}&scope=public_profile,user_friends,user_videos,user_posts`
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
  res.send({
    code,
    userId,
  });
};

export const getAccessToken = async (code) => {
  const url = `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&client_secret=${CLIENT_SECRET}&code=${code}`;
  try {
    const response = await fetch(url);

    const data = await response.json();
    console.log(data);
    return data; // Retourne le short-lived token
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
  }
};

export const getUserInfo = async (accessToken) => {
  const url = `https://graph.facebook.com/me?fields=id,name,picture.width(200).height(200),friends&access_token=${accessToken}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log("User data:", data);
  return {
    id: data.id,
    name: data.name,
    picture: data.picture.data.url,
    friends: data.friends.summary.total_count,
  };
};
