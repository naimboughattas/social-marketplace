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

export const getTwitterUserInfo = async (bearerToken) => {
  const url = `https://api.x.com/2/users/me?user.fields=profile_image_url,public_metrics`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });

  if (!response.ok)
    throw new Error("Erreur lors de la récupération des données utilisateur");

  const data = await response.json();
  const user = data.data;

  return {
    username: user.username,
    name: user.name,
    avatar: user.profile_image_url,
    followers: user.public_metrics.followers_count,
    following: user.public_metrics.following_count,
    tweets: user.public_metrics.tweet_count,
  };
};
