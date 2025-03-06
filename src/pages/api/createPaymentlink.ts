import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession(req, res);
  console.log("[🔐 SESSION]", session);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { sub: userId, email, name } = session.user;
  console.log("[👤 USER INFO]", { userId, email, name });

  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": "realize-atividades-app",
    access_token: process.env.ASAAS_ACCESS_TOKEN, // Certifique-se de que a variável está definida
  };

  console.log("[📡 REQUEST HEADERS]", headers);
  console.log("[🔑 TOKEN LENGTH]", process.env.ASAAS_ACCESS_TOKEN?.length);
  console.log("[🌐 API URL]", process.env.ASAAS_API_URL);

  try {
    // Verifica se o cliente já existe com base no externalReference (userId)
    console.log("[🔍 VERIFICANDO CLIENTE EXISTENTE]");
    const customersResponse = await axios.get(
      `${
        process.env.ASAAS_API_URL
      }/customers?externalReference=${encodeURIComponent(userId)}`,
      { headers }
    );

    console.log("[✅ CUSTOMER RESPONSE DATA]", customersResponse.data);

    let customerId;
    if (customersResponse.data.totalCount > 0) {
      customerId = customersResponse.data.data[0].id;
      console.log("[📌 CLIENTE EXISTENTE ENCONTRADO]", customerId);
    } else {
      console.log("[⚠️ CLIENTE NÃO ENCONTRADO, CRIANDO NOVO]");
      const createCustomerResponse = await axios.post(
        `${process.env.ASAAS_API_URL}/customers`,
        { name, email, externalReference: userId },
        { headers }
      );

      customerId = createCustomerResponse.data.id;
      console.log("[🆕 NOVO CLIENTE CRIADO]", customerId);
    }

    // Verifica se já existe um payment link ativo para o usuário, usando externalReference
    console.log("[🔍 VERIFICANDO PAYMENT LINK EXISTENTE]");
    const paymentLinkResponse = await axios.get(
      `${
        process.env.ASAAS_API_URL
      }/paymentLinks?externalReference=${encodeURIComponent(
        userId
      )}&status=ACTIVE`,
      { headers }
    );
    console.log("[✅ PAYMENT LINK RESPONSE DATA]", paymentLinkResponse.data);

    if (paymentLinkResponse.data.totalCount > 0) {
      console.log("[✅ PAYMENT LINK JÁ ATIVO]");
      return res.status(200).json({
        alreadySubscribed: true,
        message: "Você já possui um payment link ativo.",
      });
    }

    // Cria um novo payment link conforme a documentação
    console.log("[🚀 CRIANDO NOVO PAYMENT LINK]");
    const paymentLinkCreationResponse = await axios.post(
      `${process.env.ASAAS_API_URL}/paymentLinks`,
      {
        billingType: "UNDEFINED",
        chargeType: "RECURRENT",
        name: "Realize-Atividades",
        maxInstallmentCount: 2,
        externalReference: userId,
        callback: {
          successUrl: "https://atividades.realize.pro.br",
          autoRedirect: true,
        },
        isAddressRequired: false,
        dueDateLimitDays: 1,
      },
      { headers }
    );
    console.log(
      "[✅ PAYMENT LINK CREATED RESPONSE]",
      paymentLinkCreationResponse.data
    );

    return res.status(200).json({
      alreadySubscribed: false,
      paymentLink: paymentLinkCreationResponse.data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[❌ ERRO AXIOS]", {
        data: error.response?.data,
        status: error.response?.status,
        ASAAS_API_URLheaders: error.config.headers,
        url: error.config.url,
      });
    } else {
      console.error("[❌ ERRO DESCONHECIDO]", error);
    }

    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
