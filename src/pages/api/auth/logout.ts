import { NextApiRequest, NextApiResponse } from "next";

export default function logout(req: NextApiRequest, res: NextApiResponse) {
  const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL;
  const returnTo = process.env.AUTH0_BASE_URL;

  const logoutUrl = `${auth0Domain}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${returnTo}`;

  res.redirect(logoutUrl);
}
