import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { config } from "../../../config/environment";

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { code } = req.query as { code: string };

  const clientId = config.AUTH0_CLIENT_ID;
  const clientSecret = config.AUTH0_CLIENT_SECRET;
  const redirectUri = `${config.AUTH0_BASE_URL}/api/auth/callback`;

  try {
    // Trocar o código de autorização pelos tokens
    const response = await axios.post(`${config.AUTH0_BASE_URL}/oauth/token`, {
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    });

    const { id_token } = response.data;

    // Armazenar o token em um cookie
    res.setHeader(
      "Set-Cookie",
      `token=${id_token}; HttpOnly; Path=/; Max-Age=3600`
    );

    // Redirecionamento baseado no ambiente
    const redirectURL =
      process.env.NODE_ENV === "production"
        ? "https://atividades.realize.pro.br/form"
        : "http://localhost:3000/form";

    res.redirect(redirectURL);
  } catch (error) {
    console.error("Erro durante a autenticação:", error);
    res.status(500).json({ error: "Falha na autenticação" });
  }
}
