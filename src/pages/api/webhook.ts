import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { event, payment } = req.body;

    if (event === "PAYMENT_RECEIVED") {
      // Atualize o status do pagamento no seu banco de dados
      console.log(`Pagamento recebido: ${payment.id}`);
      // Aqui você pode adicionar lógica para atualizar o status do pagamento no banco de dados
    }

    res.status(200).json({ success: true });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
