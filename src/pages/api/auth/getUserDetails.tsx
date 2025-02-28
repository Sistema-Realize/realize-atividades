import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { userId } = req.query;

    try {
      // Fetch user details from your data source
      const response = await axios.get(`https://your-data-source.com/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.YOUR_API_TOKEN}`,
        },
      });

      const userData = response.data;

      // Extract the name and CPF/CNPJ
      const userName = userData.name;
      const cpfOrCnpj = userData.cpf || userData.cnpj;

      const {
        created_at,
        email,
        email_verified,
        family_name,
        given_name,
        identities,
        name,
        nickname,
        picture,
        updated_at,
        user_id,
        last_ip,
        last_login,
        logins_count,
        blocked_for,
        guardian_authenticators,
        passkeys
      } = userData;

      // Ensure the Asaas API key is defined
      const asaasApiKey = process.env.ASAAS_API_KEY;
      if (!asaasApiKey) {
        throw new Error('Asaas API key is not defined');
      }

      // Call Asaas API to create a customer
      const asaasUrl = 'https://api-sandbox.asaas.com/v3/customers';
      const asaasOptions = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          access_token: asaasApiKey,
        },
        body: JSON.stringify({
          name: userName,
          email: email,
          cpfCnpj: cpfOrCnpj,
          phone: userData.phone, // Assuming phone is part of userData
          mobilePhone: userData.mobilePhone, // Assuming mobilePhone is part of userData
          address: userData.address, // Assuming address is part of userData
          addressNumber: userData.addressNumber, // Assuming addressNumber is part of userData
          complement: userData.complement, // Assuming complement is part of userData
          province: userData.province, // Assuming province is part of userData
          postalCode: userData.postalCode, // Assuming postalCode is part of userData
          externalReference: userId, // Use userId as external reference
        }),
      };

      const asaasResponse = await fetch(asaasUrl, asaasOptions);
      const asaasData = await asaasResponse.json();

      if (!asaasResponse.ok) {
        throw new Error(`Asaas API error: ${asaasData.message}`);
      }

      // Use the details as needed
      res.status(200).json({
        success: true,
        userName,
        cpfOrCnpj,
        created_at,
        email,
        email_verified,
        family_name,
        given_name,
        identities,
        name,
        nickname,
        picture,
        updated_at,
        user_id,
        last_ip,
        last_login,
        logins_count,
        blocked_for,
        guardian_authenticators,
        passkeys,
        asaasCustomerId: asaasData.id
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ success: false, message: "Error fetching user details" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}