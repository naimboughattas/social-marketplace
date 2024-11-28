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
    fields: "user_id,username",
    access_token: accessToken,
  });

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
    });

    const data = await response.json();
    console.log(data); // Affiche les informations de l'utilisateur
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
