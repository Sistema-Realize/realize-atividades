import { NextApiRequest, NextApiResponse } from "next";

// Estado global para armazenar pagamento (não persistente após reinício do servidor)
let paymentStatus = false;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { event, payment } = req.body;

    if (event === "PAYMENT_RECEIVED") {
      console.log(`Pagamento recebido: ${payment.id}`);
      paymentStatus = true;
    }

    res.status(200).json({ success: true });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Função para expor o estado do pagamento
export function isPaymentConfirmed() {
  return paymentStatus;
}
