import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, paymentMethod } = req.body;

    try {
      const response = await axios.post(
        "https://www.asaas.com/api/v3/payments",
        {
          customer: userId,
          billingType: paymentMethod,
          value: 100.0, // Substitua pelo valor real
          dueDate: new Date().toISOString().split("T")[0], // Data de vencimento
        },
        {
          headers: {
            "Content-Type": "application/json",
            access_token: process.env.ASAAS_API_KEY, // Use uma variável de ambiente para a chave da API
          },
        }
      );

      res
        .status(200)
        .json({ success: true, paymentUrl: response.data.invoiceUrl });
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro ao criar pagamento" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
