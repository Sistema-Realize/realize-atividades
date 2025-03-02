import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ message: `Método ${req.method} não permitido` });
  }

  try {
    // Simulando uma chamada para uma API externa
    const externalApiResponse = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    const externalData = await externalApiResponse.json();

    // Estrutura do retorno simulado
    const responseData = {
      message: "Dados recebidos com sucesso",
      data: {
        competencia: "Matemática Avançada",
        valor: 100.0,
        questoes: [
          { id: 1, texto: "Qual é a integral de x^2?" },
          { id: 2, texto: "Resolva a equação diferencial dy/dx = 3x^2." },
        ],
        externalApiData: externalData, // Dados da API externa
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return res.status(500).json({ message: "Erro ao buscar dados externos" });
  }
}
