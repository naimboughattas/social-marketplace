import { db } from "../firebase";
const { collection, addDoc, Timestamp } = require("firebase/firestore");
const { getCachedData } = require("../redis");

export const generateAuthURL = async (req, res) => {
  const CLIENT_KEY = "sbaw0c0ngctkgyhbr1";
  const csrfState = Math.random().toString(36).substring(2);
  res.cookie("csrfState", csrfState, { maxAge: 60000 });

  let authUrl = "https://www.tiktok.com/v2/auth/authorize/";

  // the following params need to be in `application/x-www-form-urlencoded` format.
  authUrl += `?client_key=${CLIENT_KEY}`;
  authUrl += "&scope=user.info.basic,user.info.profile,user.info.stats";
  authUrl += "&response_type=code";
  authUrl += "&redirect_uri=https://the-reach-market-api.vercel.app/cb/tiktok";
  authUrl += `&state=${req.query.userId}`;
  res.redirect(authUrl);
};

export const OAuthCallback = async (req, res) => {
  const code = req.query.code; // Code d'autorisation reçu après l'authentification
  const userId = req.query.state; // userId passé dans le paramètre 'state'

  console.log("Authorization code:", code);
  console.log("userId:", userId);

  try {
    // Étape 2 : Effectuer une requête POST pour obtenir le token d'accès avec fetch
    const response = await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Type de contenu pour les données POST
        },
        body: new URLSearchParams({
          client_key: "sbaw0c0ngctkgyhbr1", // Ton Client ID TikTok
          client_secret: "6CEa2bQJur3FUlkXEUN5WDTRCzXMadoa", // Ton Client Secret TikTok
          code, // Le code d'autorisation reçu
          grant_type: "authorization_code", // Type de demande : code d'autorisation
          redirect_uri: "https://the-reach-market-api.vercel.app/cb/tiktok", // L'URL de redirection
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to retrieve access token");
    }

    // Si la réponse est OK, on récupère les données
    const data = await response.json();

    // Le token d'accès et d'autres informations se trouvent dans la réponse
    const { access_token, open_id } = data;

    console.log("Access Token:", access_token);
    console.log("Open ID:", open_id);

    // Étape 2 : Utiliser le access_token pour récupérer les informations du profil TikTok
    const userInfoResponse = await fetch(
      `https://open.tiktokapis.com/v2/user/info/?fields=is_verified,open_id,union_id,avatar_url,username,follower_count,following_count,likes_count,video_count`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`, // On passe le token dans l'en-tête Authorization
        },
      }
    );
    console.log("userInfoResponse:", userInfoResponse);

    if (!userInfoResponse.ok) {
      throw new Error("Failed to retrieve user info from TikTok");
    }

    // Si la réponse est OK, on récupère les données du profil
    const userInfoData = await userInfoResponse.json();

    console.log("User Info:", userInfoData);

    // Associer le token d'accès et d'autres données avec ton utilisateur
    // Par exemple, tu peux enregistrer ce token dans ta base de données avec l'userId
    // Exemple : Enregistrer le token dans une base de données associée à userId
    const formData = await getCachedData(userId);
    console.log("formData:", formData);
    const accountRef = await addDoc(collection(db, "socialAccounts"), {
      userId,
      code,
      token: access_token,
      ...formData,
      ...userInfoData.data.user,
      createdAt: Timestamp.now(),
    });
    res.redirect(
      "https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts"
    );
  } catch (error) {
    console.error("Error while retrieving access token from TikTok:", error);
    res.status(500).json({
      error: "Failed to obtain access token",
      details: error.message,
    });
  }
};
