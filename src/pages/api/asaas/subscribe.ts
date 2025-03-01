import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { paymentMethod, userName } = req.body;

  if (!userName || typeof userName !== "string") {
    return res.status(400).json({ error: "Nome do usuário é obrigatório" });
  }

  if (!["PIX", "BOLETO", "CREDIT_CARD"].includes(paymentMethod)) {
    return res.status(400).json({ error: "Método de pagamento inválido" });
  }

  try {
    const response = await axios.post(
      "https://api-sandbox.asaas.com/v3/paymentLinks",
      {
        billingType: paymentMethod,
        chargeType: "RECURRENT",
        name: userName,
        dueDateLimitDays: 1,
        callback: { successUrl: "https://atividades.realize.pro.br" },
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.ASAAS_ACCESS_TOKEN}`,
        },
      }
    );

    return res.status(200).json({ invoiceUrl: response.data.invoiceUrl });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Erro ao criar link de pagamento:", error.response.data);
      return res.status(error.response.status).json({
        error: error.response.data,
      });
    } else {
      console.error("Erro ao criar link de pagamento:", error);
      return res.status(500).json({
        error: "Erro ao criar pagamento",
      });
    }
  }
}
