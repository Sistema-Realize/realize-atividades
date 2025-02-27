import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Simule o processamento dos arquivos
    const files = req.body.files || []; // Simule a obtenção dos nomes dos arquivos

    // Retorne um JSON com o nome dos arquivos
    res.status(200).json({
      message: "Arquivos recebidos",
      files: files.map(
        (file: { name: string }) => file.name || "arquivo_simulado.pdf"
      ),
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
