// Étape 1 : Échanger le short-lived token pour un long-lived token
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
export const getInstagramProfileData = async (igBusinessAccountId, accessToken) => {
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
