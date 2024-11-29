import { Client, auth } from "twitter-api-sdk";

export const authClient = new auth.OAuth2User({
  client_id: "bjF0anFlY1RIc2VpZDdvRTBRdjU6MTpjaQ",
  client_secret: "AF2Gru6sDAOlcJE0NTrwzvQ6W5Hr4ZyEUAKPQ1Bz24vXz-QgWr",
  callback: `https://the-reach-market-api.vercel.app/cb/x`,
  scopes: ["tweet.read", "users.read"],
});

export const client = new Client(authClient);

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
