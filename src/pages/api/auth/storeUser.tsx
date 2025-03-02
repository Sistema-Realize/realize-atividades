import axios from "axios";
import { config } from "../../../config/environment";

export async function getUserInfo(userId: string, accessToken: string) {
  try {
    const { data } = await axios.get(
      `https://${config.AUTH0_DOMAIN}/api/v2/users/${userId}`,
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
