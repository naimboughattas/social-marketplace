const CLIENT_ID = "780d3m61bi94hx";
const CLIENT_SECRET = "WPL_AP1.TgARA6RNgPla8T4z.vwO3/A==";

export const generateAuthURL = (req, res) => {
  const REDIRECT_URI = "https://the-reach-market-api.vercel.app/cb/linkedin";
  res.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${req.query.userId}&scope=openid,profile,email`
  );
};

export const OAuthCallback = async (req, res) => {
  const code = req.query.code; // Code d'autorisation reçu après l'authentification
  const userId = req.query.state; // userId passé dans le paramètre 'state'
  const { access_token } = await getAccessToken();
  const userInfo = await getUserInfo(access_token);
  res.send({
    code,
    userId,
    userInfo,
  });
};

export const getAccessToken = async (code) => {
  const response = await fetch(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        
      }),
    }
  );
  const tokens = await response.json();
  console.log("tokens:", tokens);
  return tokens;
};

export const getUserInfo = async (accessToken) => {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const userInfo = await response.json();
  console.log("userInfo:", userInfo);
  return userInfo;
};
