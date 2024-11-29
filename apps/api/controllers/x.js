const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

// Votre API keys de Twitter
const TWITTER_CONSUMER_KEY = "bjF0anFlY1RIc2VpZDdvRTBRdjU6MTpjaQ";
const TWITTER_CONSUMER_SECRET =
  "AF2Gru6sDAOlcJE0NTrwzvQ6W5Hr4ZyEUAKPQ1Bz24vXz-QgWr";
const TWITTER_CALLBACK_URL = "https://the-reach-market-api.vercel.app/cb/x"; // Remplacez par votre URL de redirection

// Configurez la stratégie de Passport pour Twitter
passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: TWITTER_CALLBACK_URL,
    },
    (token, tokenSecret, profile, done) => {
      // Vous pouvez ici sauvegarder l'utilisateur dans la base de données
      // ou le renvoyer directement
      return done(null, { profile, token, tokenSecret });
    }
  )
);

// Sérialisation et désérialisation de l'utilisateur
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

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
