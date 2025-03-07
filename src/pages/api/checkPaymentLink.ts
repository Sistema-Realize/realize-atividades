import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// Define a type for the subscription object
type Subscription = {
  status: string;
  paymentLink?: string;
  // Add other fields as necessary
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getSession(req, res);
  console.log("[🔐 SESSION]", session);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { sub: userId } = session.user;
  console.log("[👤 USER INFO]", { userId });

  // Configuração dos headers, utilizando a variável de ambiente para o token
  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    access_token:
      "$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmFlOGVmODI2LTAzZWUtNGQyYi1hZWMyLTk1ZWFiYWRjZDNkMjo6JGFhY2hfODRmZTY3NTktMjQ0Yy00NmQ1LTlmMDEtOTg2NWZkOGFmY2M3",
  };

  console.log("[📡 REQUEST HEADERS]", headers);
  console.log("[🌐 API URL]", process.env.ASAAS_API_URL);

  try {
    console.log("[🔍 CONSULTANDO ASSINATURAS]");
    const response = await axios.get(
      `${
        process.env.ASAAS_API_URL
      }/subscriptions?externalReference=${encodeURIComponent(userId)}`,
      { headers }
    );

    console.log("[✅ SUBSCRIPTIONS RESPONSE DATA]", response.data);
    const paymentLinkData = response.data;

    // Verifica se há alguma assinatura ativa com paymentLink definido
    let activePaymentLink = null;
    if (paymentLinkData.totalCount > 0) {
      activePaymentLink = paymentLinkData.data.find(
        (sub: Subscription) => sub.status === "ACTIVE" && sub.paymentLink
      );
    }

    if (activePaymentLink) {
      return res.status(200).json({ activePaymentLink });
    } else {
      return res
        .status(404)
        .json({ error: "Nenhum paymentLink ativo encontrado." });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[❌ ERRO AXIOS]", {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.config?.headers,
        url: error.config?.url,
      });
    } else {
      console.error("[❌ ERRO DESCONHECIDO]", error);
    }
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
