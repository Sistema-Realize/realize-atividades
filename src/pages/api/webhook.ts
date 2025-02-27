import { NextApiRequest, NextApiResponse } from "next";

// Simulação de um banco de dados ou estado global
let paymentStatus = false;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { event, payment } = req.body;

    if (event === "PAYMENT_RECEIVED") {
      // Atualize o status do pagamento no seu banco de dados ou estado global
      console.log(`Pagamento recebido: ${payment.id}`);
      paymentStatus = true; // Atualize o estado para indicar que o pagamento foi confirmado
    }

    res.status(200).json({ success: true });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export function isPaymentConfirmed() {
  return paymentStatus;
}
