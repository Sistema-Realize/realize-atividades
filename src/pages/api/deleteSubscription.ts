import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import axios from "axios";

// Opcional: defina o tipo da assinatura, se necessário
type Subscription = {
  id: string;
  status: string;
  paymentLink?: string;
  // Outros campos podem ser adicionados conforme necessário
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getSession(req, res);
    console.log("[🔐 SESSION]", session);

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { sub: userId, email, name } = session.user;
    console.log("[👤 USER INFO]", { userId, email, name });

    // Configuração dos headers utilizando variável de ambiente para o token
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "realize-atividades-app",
      access_token:
        "$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmFlOGVmODI2LTAzZWUtNGQyYi1hZWMyLTk1ZWFiYWRjZDNkMjo6JGFhY2hfODRmZTY3NTktMjQ0Yy00NmQ1LTlmMDEtOTg2NWZkOGFmY2M3", // Token definido em variável de ambiente
    };

    console.log("[📡 REQUEST HEADERS]", headers);
    console.log("[🌐 API URL]", process.env.ASAAS_API_URL);

    // Consulta a assinatura do usuário através do externalReference
    console.log("[🔍 CONSULTANDO ASSINATURA]");
    const subscriptionsResponse = await axios.get(
      `${
        process.env.ASAAS_API_URL
      }/subscriptions?externalReference=${encodeURIComponent(userId)}`,
      { headers }
    );
    console.log("[✅ SUBSCRIPTIONS RESPONSE DATA]", subscriptionsResponse.data);

    // Verifica se existe alguma assinatura para o usuário
    if (subscriptionsResponse.data.totalCount === 0) {
      return res.status(404).json({ error: "Assinatura não encontrada" });
    }

    // Seleciona a primeira assinatura encontrada (pode ser ajustado conforme a lógica do negócio)
    const subscription: Subscription = subscriptionsResponse.data.data[0];
    console.log("[🔍 ASSINATURA A SER DELETADA]", subscription);

    // Executa a deleção da assinatura utilizando o ID da assinatura
    console.log("[🔍 DELETANDO ASSINATURA]");
    const deleteResponse = await axios.delete(
      `${process.env.ASAAS_API_URL}/subscriptions/${subscription.id}`,
      { headers }
    );
    console.log("[✅ DELETE RESPONSE DATA]", deleteResponse.data);

    return res.status(200).json({
      message: "Assinatura deletada com sucesso",
      data: deleteResponse.data,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[❌ ERRO AXIOS]", {
        data: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      });
    } else {
      console.error("[❌ ERRO DESCONHECIDO]", error);
    }
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
