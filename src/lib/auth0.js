import axios from "axios";
import { getManagementToken } from "./getManagementToken";
import { getCookie, setCookie } from "cookies-next";
import { config } from "../config/environment";

/**
 * Obtém as informações do usuário do Auth0 e armazena nos cookies
 */
export async function getUserInfo(userId) {
  try {
    const accessToken = await getManagementToken();

    const { data } = await axios.get(
      `https://${config.AUTH0_DOMAIN}/api/v2/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Armazena os dados do usuário no cookie
    setCookie("user", JSON.stringify(data), {
      maxAge: 60 * 60 * 24 * 7, // Expira em 7 dias
      path: "/",
    });

    return data;
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
    throw new Error("Erro ao buscar informações do usuário");
  }
}

/**
 * Recupera os dados do usuário armazenados nos cookies
 */
export function getUserData() {
  const user = getCookie("user");
  return user ? JSON.parse(user) : null;
}
