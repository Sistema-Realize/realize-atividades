import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Dados fictícios
    const data = {
      competencia: "Matemática Avançada",
      valor: 100.0,
      questoes: [
        { id: 1, texto: "Qual é a integral de x^2?" },
        { id: 2, texto: "Resolva a equação diferencial dy/dx = 3x^2." },
      ],
    };

    // Retorne um JSON com dados fictícios
    res.status(200).json({ message: "Dados obtidos com sucesso", data });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
