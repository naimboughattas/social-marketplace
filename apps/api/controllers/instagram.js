import { db } from "../firebase";
const { collection, addDoc, Timestamp } = require("firebase/firestore");
const { getCachedData } = require("../redis");

export const generateAuthURL = async (req, res) => {
  const authUrl = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=1617513219147291&redirect_uri=https://the-reach-market-api.vercel.app/cb/instagram&state=${req.query.userId}&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish`;
  res.redirect(authUrl);
};

export const OAuthCallback = async (req, res) => {
  const { code, state: userId } = req.query; // Récupère le code envoyé par Instagram après la validation
  console.log("state:", userId, "code:", code);

  const q = query(collection(db, "socialAccounts"), where("code", "==", code));

  const snapshot = await getDocs(q);
  const accounts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const accountByCode = accounts.find((account) => account.code === code);
  if (accountByCode) {
    res.redirect(
      "https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts"
    );
  }

  try {
    const { access_token, user_id } = await getAccessToken(code);
    // const shortLivedToken = "IGQWROeUt1ZA3lvU2p2SW1MeW10Qk90S1RLS2JGc2p1UndJeXlZAcUY4dkpKWGJBMVVKNVZAWeEx1OW10NU1BVFNod01hUlZAqNEpyY3ZAXYVpUejJRMkM0X3MxbWZAWYkJYVFV2Sk0tS0luQW10Y2xJVW1ITlFVTXFYUTdzMTVZAS2J2eUgwd0kZD";
    console.log("short lived token:", access_token);

    const pageData = await getInstagramUserInfo(access_token);
    const formData = await getCachedData(userId);
    console.log("formData:", formData);
    const accountRef = await addDoc(collection(db, "socialAccounts"), {
      userId,
      pageId: user_id,
      code,
      token: access_token,
      ...formData,
      ...pageData,
      createdAt: Timestamp.now(),
    });
    res.redirect(
      "https://the-reach-market-dashboard.vercel.app/dashboard/my-accounts"
    );
  } catch (error) {
    console.log(error);
    throw new Error("Failed to exchange code for token", error);
  }
};

// Étape 1 : Échanger le short-lived token pour un long-lived token
export const getAccessToken = async (code) => {
  const clientId = "1617513219147291";
  const clientSecret = "3c5ff784e66d4de157b09b5a43cb64c2";
  const redirectUri = "https://the-reach-market-api.vercel.app/cb/instagram"; // Redirection après l'authentification Instagram
  const url = "https://api.instagram.com/oauth/access_token";
  const formData = new URLSearchParams();

  formData.append("client_id", clientId);
  formData.append("client_secret", clientSecret);
  formData.append("grant_type", "authorization_code");
  formData.append("redirect_uri", redirectUri);
  formData.append("code", code);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await response.json();
    console.log(data);
    return data; // Retourne le short-lived token
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
  }
};

export const getLongLivedToken = async (shortLivedToken, appSecret) => {
  try {
    const response = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortLivedToken}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data.access_token; // Retourne le long-lived token
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du long-lived token :",
      error.message
    );
  }
};

export const getInstagramUserInfo = async (accessToken) => {
  const url = "https://graph.instagram.com/v21.0/me";
  const params = new URLSearchParams({
    fields:
      "user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count",
    access_token: accessToken,
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
    });

    const data = await response.json();
    console.log(data); // Affiche les informations de l'utilisateur
    return data; // Retourne les informations de l'utilisateur
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
  }
};

// Étape 2 : Récupérer l'ID du compte Instagram professionnel
export const getInstagramBusinessAccountId = async (accessToken) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=instagram_business_account&access_token=${accessToken}`
    );
    const data = await response.json();
    if (response.ok) {
      const igBusinessAccountId = data.data[0]?.instagram_business_account?.id;
      if (!igBusinessAccountId)
        throw new Error("Aucun compte Instagram professionnel trouvé.");
      return igBusinessAccountId;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'ID Instagram Business :",
      error.message
    );
  }
};

// Étape 3 : Récupérer les données du compte Instagram (followers_count, etc.)
export const getInstagramProfileData = async (
  igBusinessAccountId,
  accessToken
) => {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${igBusinessAccountId}?fields=name,username,followers_count&access_token=${accessToken}`
    );
    const data = await response.json();
    if (response.ok) {
      return data; // Retourne les données du profil Instagram
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données du profil :",
      error.message
    );
  }
};
