import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
      const { paymentId } = req.body;
      try {
        const response = await axios.get(
          `https://sandbox.asaas.com/api/v3/payments/${paymentId}`,
          {
            headers: {
              "Content-Type": "application/json",
              access_token: process.env.ASAAS_API_KEY,
            },
          }
        );
        const status = response.data.status;
        res.status(200).json({ success: true, status });
      } catch (error) {
        console.error("Erro ao verificar status do pagamento:", error);
        res.status(500).json({ success: false, message: "Erro ao verificar status do pagamento" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  