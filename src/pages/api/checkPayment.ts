import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { paymentId } = req.query;

    try {
      const response = await axios.get(
        `https://sandbox.asaas.com/api/v3/payments/${paymentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            access_token: process.env.ASAAS_API_KEY, // Use uma variável de ambiente para a chave da API
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro ao verificar pagamento" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
