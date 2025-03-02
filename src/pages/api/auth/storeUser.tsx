import axios from "axios";
import { setCookie, getCookie } from "cookies-next";
import { config } from "../../../config/environment";

interface UserData {
  name: string;
  email: string;
  picture: string;
}

export async function getUserInfo(userId: string, accessToken: string) {
  try {
    const { data } = await axios.get(
      `https://${config.AUTH0_DOMAIN}/api/v2/users/${userId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro ao buscar informações do usuário:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erro desconhecido ao buscar informações do usuário:",
        error
      );
    }
    throw new Error("Erro ao buscar informações do usuário");
  }
}

// Função para armazenar os dados do usuário nos cookies
export function storeUserData(user: UserData) {
  setCookie("user", JSON.stringify(user), {
    maxAge: 60 * 60 * 24 * 7, // Expira em 7 dias
    path: "/",
    httpOnly: false, // true se quiser que o cookie seja acessível apenas pelo servidor
    secure: process.env.NODE_ENV === "production",
  });
}

// Função para recuperar os dados do usuário dos cookies
export function getUserData() {
  const user = getCookie("user");
  return user ? JSON.parse(user as string) : null;
}
