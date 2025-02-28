import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import jwt from "jsonwebtoken"; // Optional: For decoding JWTs

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { code } = req.query as { code: string };
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL as string;
  const clientId = process.env.AUTH0_CLIENT_ID as string;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET as string;
  const redirectUri =
    `${process.env.AUTH0_BASE_URL}/api/auth/callback` as string;

  try {
    // Exchange the authorization code for tokens
    const response = await axios.post(`${auth0Domain}/oauth/token`, {
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    });

    const { id_token } = response.data;

    // Optionally decode the ID token to get user information
    const decodedToken = jwt.decode(id_token);

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
