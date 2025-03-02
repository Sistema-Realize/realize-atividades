import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { config } from "../../../config/environment";

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { code } = req.query as { code: string };

  const clientId = config.AUTH0_CLIENT_ID as string;
  const clientSecret = config.AUTH0_CLIENT_SECRET as string;
  const redirectUri = `${config.AUTH0_BASE_URL}/api/auth/callback` as string;

  try {
    // Exchange the authorization code for tokens
    const response = await axios.post(`${config.AUTH0_DOMAIN}/oauth/token`, {
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    });

    const { id_token } = response.data;

    // Store the token in a cookie or session
    res.setHeader(
      "Set-Cookie",
      `token=${id_token}; HttpOnly; Path=/; Max-Age=3600`
    );

    // Redirect to the form page instead of the dashboard
    res.redirect("/form");
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}
