import jwt from "jsonwebtoken";

const AUTH0_PUBLIC_KEY = process.env.AUTH0_PUBLIC_KEY || ""; // 🔹 Adicione sua chave pública do Auth0 aqui

export const verifyAuth0Token = (token: string): unknown => {
  try {
    const decoded = jwt.verify(token, AUTH0_PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    return decoded;
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return null;
  }
};
