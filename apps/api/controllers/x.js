// Récupération du Bearer Token
export const getBearerToken = async (consumerKey, consumerSecret) => {
  const credentials = btoa(`${consumerKey}:${consumerSecret}`); // Encodage en Base64
  const url = "https://api.twitter.com/oauth2/token";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok)
    throw new Error("Erreur lors de l’obtention du Bearer Token");

  const data = await response.json();
  return data.access_token; // Le token obtenu
};

// Récupération des données utilisateur
export const getTwitterData = async (username, bearerToken) => {
  const url = `https://api.twitter.com/2/users/by/username/${username}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });

  if (!response.ok)
    throw new Error("Erreur lors de la récupération des données Twitter");

  const data = await response.json();
  return data;
};

export const getTwitterUserInfo = async (username, bearerToken) => {
  const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=profile_image_url,public_metrics`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    const data = await response.json();
    console.log("getTwitterUserInfo: ", data);
    const user = data.data;

    return user;
  } catch (error) {
    console.error("Erreur lors de la requête :", error);
    return error;
  }
};
