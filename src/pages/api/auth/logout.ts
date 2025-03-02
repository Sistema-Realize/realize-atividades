import { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../../config/environment";

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  const auth0Domain = config.AUTH0_ISSUER_BASE_URL;
  const returnTo = config.AUTH0_BASE_URL;

  const logoutUrl = `${auth0Domain}/v2/logout?client_id=${config.AUTH0_CLIENT_ID}&returnTo=${returnTo}`;

  res.redirect(logoutUrl);
}
