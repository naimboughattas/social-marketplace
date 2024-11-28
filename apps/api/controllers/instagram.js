const clientId = "1617513219147291";
const clientSecret = "3c5ff784e66d4de157b09b5a43cb64c2";
const redirectUri = "https://the-reach-market-api.vercel.app/cb/instagram"; // Redirection après l'authentification Instagram

export const getInstagramData = async (code) => {
  const response = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Form URL Encoded
    },
  });
  const { access_token, user_id } = await response.json();
  console.log("access_token:", access_token, "user_id:", user_id);
  const userResponse = await fetch(
    `https://graph.facebook.com/v21.0/${user_id}?fields=name,username,followers_count&access_token=${access_token}`
  );

  const igData = await userResponse.json();
  console.log("igData:", igData);
  return igData;
};
