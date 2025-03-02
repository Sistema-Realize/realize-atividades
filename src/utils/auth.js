import axios from "axios";
import { getManagementToken } from "./auth0";

export async function getUserInfo(userId) {
  try {
    const accessToken = await getManagementToken();

    const { data } = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return data;
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
    throw new Error("Erro ao buscar informações do usuário");
  }
}
