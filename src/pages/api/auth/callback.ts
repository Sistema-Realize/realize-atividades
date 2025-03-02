import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { config } from "../../../config/environment";

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { code } = req.query as { code: string };

  if (!code) {
    return res.status(400).json({ error: "Código de autorização ausente" });
  }

  const clientId = config.AUTH0_CLIENT_ID;
  const clientSecret = config.AUTH0_CLIENT_SECRET;
  const redirectUri = `${config.NEXT_PUBLIC_BASE_URL}/api/auth/callback`;

  try {
    // Troca o código de autorização pelos tokens
    const response = await axios.post(
      `https://${config.AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }
    );

    const { id_token } = response.data;

    // Armazena o token em um cookie seguro
    res.setHeader(
      "Set-Cookie",
      `token=${id_token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`
    );

    // Define a URL de redirecionamento corretamente
    const redirectURL = `${config.NEXT_PUBLIC_BASE_URL}/form`;

    res.redirect(redirectURL);
  } catch (error) {
    console.error("Erro durante a autenticação:", error);
    res.status(500).json({ error: "Falha na autenticação" });
  }
}
