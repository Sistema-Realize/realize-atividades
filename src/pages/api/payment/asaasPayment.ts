import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, paymentMethod, value } = req.body;

    try {
      // Create a customer in Asaas using the userId
      const customerResponse = await axios.post(
        "https://api-sandbox.asaas.com/v3/customers",
        {
          name: "Customer Name", // Replace with actual data
          email: "customer@example.com", // Replace with actual data
          cpfCnpj: "12345678909", // Replace with actual data
          externalReference: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            access_token: process.env.ASAAS_API_KEY,
          },
        }
      );

      const customerId = customerResponse.data.id;

      // Create a payment link
      const paymentResponse = await axios.post(
        "https://api-sandbox.asaas.com/v3/payments",
        {
          customer: customerId,
          billingType: paymentMethod,
          value: value,
          dueDate: new Date().toISOString().split("T")[0],
          description: "Payment Description",
          callbackUrl: "http://localhost:3000/api/payment/callback", // Your callback URL
        },
        {
          headers: {
            "Content-Type": "application/json",
            access_token: process.env.ASAAS_API_KEY,
          },
        }
      );

      res.status(200).json({ success: true, paymentUrl: paymentResponse.data.invoiceUrl });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ success: false, message: "Error creating payment" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
