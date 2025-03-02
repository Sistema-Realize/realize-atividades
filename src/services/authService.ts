import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

/**
 * Armazena os dados do usuário em um cookie seguro
 */
export const storeUserCookie = (
  res: NextApiResponse,
  userData: { name: string; email: string; sub: string }
) => {
  const userCookie = JSON.stringify(userData);

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("user", userCookie, {
      httpOnly: true, // Torna o cookie inacessível ao JavaScript do frontend
      secure: process.env.NODE_ENV === "production", // Apenas em HTTPS em produção
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })
  );
};

/**
 * Função para lidar com login do usuário e armazenar no cookie
 */
export const handleUserLogin = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { name, email, sub } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  storeUserCookie(res, { name, email, sub });

  return res.status(200).json({ message: "Usuário armazenado com sucesso" });
};
