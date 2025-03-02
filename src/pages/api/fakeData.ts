import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Método ${req.method} não permitido` });
  }

  // Dados fictícios retornados diretamente
  const data = {
    competencia: "Física Moderna",
    valor: 120.5,
    questoes: [
      { id: 1, texto: "Explique a teoria da relatividade restrita." },
      { id: 2, texto: "Qual é a equação de Schrödinger?" },
    ],
  };

  return res.status(200).json({ message: "Dados obtidos com sucesso", data });
}
