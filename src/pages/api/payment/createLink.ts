import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getUserInfo } from "../auth/storeUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, paymentMethod } = req.body;

  try {
    // Obter Access Token
    const { data: tokenData } = await axios.get(
      `${process.env.BASE_URL}/api/auth/getAccessToken`
    );
    const accessToken = tokenData.accessToken;

    // Obter informações do usuário
    const user = await getUserInfo(userId, accessToken);

    // Configurar dados do link de pagamento
    const paymentData = {
      name: user.name,
      description: "Serviço X",
      value: 100.0,
      billingType: paymentMethod,
      dueDateLimitDays: 10,
      callback: { successUrl: `${process.env.BASE_URL}/result` },
    };

    // Criar link de pagamento no Asaas
    const { data } = await axios.post(
      "https://api.asaas.com/v3/paymentLinks",
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
          access_token: process.env.ASAAS_API_KEY,
        },
      }
    );

    res.status(200).json({ paymentLink: data.url });
  } catch (error) {
    console.error("Erro ao criar link de pagamento:", error);
    res.status(500).json({ error: "Erro ao criar link de pagamento" });
  }
}
