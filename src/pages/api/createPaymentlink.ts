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
    // Você pode manter o token hardcoded para teste ou utilizar process.env
    access_token:
      "$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmFlOGVmODI2LTAzZWUtNGQyYi1hZWMyLTk1ZWFiYWRjZDNkMjo6JGFhY2hfODRmZTY3NTktMjQ0Yy00NmQ1LTlmMDEtOTg2NWZkOGFmY2M3",
  };

  console.log("[📡 REQUEST HEADERS]", headers);
  console.log("[🌐 API URL]", process.env.ASAAS_API_URL);

  try {
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
      const existingPaymentLink = paymentLinkResponse.data.data[0];
      console.log("[✅ PAYMENT LINK JÁ ATIVO]", existingPaymentLink);
      return res.status(200).json({
        alreadySubscribed: true,
        paymentLinkUrl: existingPaymentLink.url,
      });
    }

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

    // Supondo que o objeto retornado contenha a URL em paymentLinkCreationResponse.data.url
    const createdPaymentLinkUrl = paymentLinkCreationResponse.data.url;
    return res.status(200).json({
      alreadySubscribed: false,
      paymentLinkUrl: createdPaymentLinkUrl,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[❌ ERRO AXIOS]", {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.config.headers,
        url: error.config.url,
      });
    } else {
      console.error("[❌ ERRO DESCONHECIDO]", error);
    }
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
