import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import jwt from "jsonwebtoken";

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const redirectUri = `${process.env.AUTH0_BASE_URL}/api/auth/callback`;

  try {
    const response = await axios.post(`${auth0Domain}/oauth/token`, {
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    });

    const { id_token } = response.data;
    const user = jwt.decode(id_token);

    // Armazene o token ou informações do usuário conforme necessário
    res.redirect("/form");
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
}
