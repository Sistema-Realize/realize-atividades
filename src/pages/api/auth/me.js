import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(req, res) {
  try {
    const session = await getSession(req, res);

    if (!session || !session.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    return res.status(200).json({ user: session.user });
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
