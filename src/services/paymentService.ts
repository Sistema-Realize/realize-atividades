import { NextApiRequest, NextApiResponse } from "next";
import { getUserCookie } from "../utils/axiosInstance";
import { config } from "../config/environment";
import axios from "axios";

export const createPaymentLink = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const user = getUserCookie(req, res);
  if (!user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  try {
    const customerResponse = await axios.post(
      `${config.NEXT_PUBLIC_ASAAS_API_URL}/customers`,
      {
        name: user.name,
        email: user.email,
        externalReference: user.sub,
      },
      {
        headers: { Authorization: `Bearer ${config.ASAAS_API_KEY}` },
      }
    );

    const customerData = customerResponse.data;
    if (!customerData.id) {
      return res.status(400).json({ error: "Erro ao criar cliente na Asaas" });
    }

    const paymentResponse = await axios.post(
      `${config.NEXT_PUBLIC_ASAAS_API_URL}/payments`,
      {
        customer: customerData.id,
        billingType: "PIX",
        value: 100.0,
        dueDate: new Date().toISOString().split("T")[0],
      },
      {
        headers: { Authorization: `Bearer ${config.ASAAS_API_KEY}` },
      }
    );

    const paymentData = paymentResponse.data;
    res.status(200).json({ paymentLink: paymentData.invoiceUrl });
  } catch (error) {
    console.error("Erro na integração com Asaas:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
