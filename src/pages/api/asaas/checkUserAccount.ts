import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const options = {
  method: "GET",
  url: "https://api-sandbox.asaas.com/v3/customers?cpfCnpj=39847800871",
  headers: {
    accept: "application/json",
    access_token:
      "$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjEzYWE5ZmNiLTI2ODQtNGJlYS05Yjk1LTZiN2I0OWQ2NWIwMzo6JGFhY2hfNzI4M2VhMDMtNGM4ZS00OWY0LTg4ZmQtZjQxMDdkY2E3YTQw",
  },
};

axios
  .request(options)
  .then((res) => console.log(res.data))
  .catch((err) => console.error(err));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { cpfCnpj } = req.body;

    // Build your request to Asaas (sandbox) to check if there's a subscription (or customer) with this CPF.
    // Adjust the endpoint & query logic as needed, since Asaas might require searching by customer, not subscription.
    const options = {
      method: "GET",
      url: "https://api-sandbox.asaas.com/v3/subscriptions",
      headers: {
        accept: "application/json",
        access_token:
          "$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjEzYWE5ZmNiLTI2ODQtNGJlYS05Yjk1LTZiN2I0OWQ2NWIwMzo6JGFhY2hfNzI4M2VhMDMtNGM4ZS00OWY0LTg4ZmQtZjQxMDdkY2E3YTQw",
      },
    };

    // Perform the GET request to Asaas
    const response = await axios.request(options);
    // The response data typically has a 'data' field with an array of subscriptions.
    const asaasData = response.data;

    const isCpfCnpjTaken = asaasData.data?.some(
      (subscription: { customerDocument: string }) => {
        return subscription.customerDocument === cpfCnpj;
      }
    );

    return res.status(200).json({ exists: isCpfCnpjTaken });
  } catch (error) {
    console.error("Error verifying CPF/CNPJ:", error);
    return res.status(500).json({ message: "Error verifying CPF/CNPJ" });
  }
}
