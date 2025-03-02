import { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../../config/environment";

export default function login(req: NextApiRequest, res: NextApiResponse) {
  const auth0Domain = config.AUTH0_ISSUER_BASE_URL;
  const clientId = config.AUTH0_CLIENT_ID;
  const redirectUri = `${config.AUTH0_BASE_URL}/api/auth/callback`;

  const authUrl = `${auth0Domain}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid profile email`;

  res.redirect(authUrl);
}
