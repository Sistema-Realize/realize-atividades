import type { NextApiRequest, NextApiResponse } from "next";

// Defina um tipo para o objeto de pagamento
interface Payment {
  id: string;
  value: number;
  status: string;
  // Adicione outros campos conforme necessário
}

// Função para lidar com a criação de pagamento
function createPayment(payment: Payment) {
  // Lógica para processar a criação de pagamento
  console.log("Pagamento criado:", payment);
}

// Função para lidar com o recebimento de pagamento
function receivePayment(payment: Payment) {
  // Lógica para processar o recebimento de pagamento
  console.log("Pagamento recebido:", payment);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const body = req.body;

    switch (body.event) {
      case "PAYMENT_CREATED": {
        const payment = body.payment;
        createPayment(payment);
        break;
      }
      case "PAYMENT_RECEIVED": {
        const payment = body.payment;
        receivePayment(payment);
        break;
      }
      // ... trate outros eventos
      default:
        console.log(`Este evento não é aceito ${body.event}`);
    }

    // Retorne uma resposta para dizer que o webhook foi recebido
    res.json({ received: true });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
