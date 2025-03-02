import axios from "axios";
import { config } from "../../../config/environment";

interface UserData {
  email: string;
  password: string;
  connection: string;
  name?: string;
}

// Função para criar um usuário no Auth0
const createAuth0User = async (userData: UserData) => {
  try {
    const response = await axios.post(
      `https://${config.AUTH0_DOMAIN}/api/v2/users`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${config.AUTH0_MANAGEMENT_API_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro ao criar usuário no Auth0:",
        error.response?.data || error.message
      );
    } else {
      console.error("Erro desconhecido ao criar usuário no Auth0:", error);
    }
    return null;
  }
};

// Função para verificar ou criar um usuário no Auth0
export const findOrCreateAuth0User = async (userData: UserData) => {
  try {
    const existingUserResponse = await axios.get(
      `https://${config.AUTH0_DOMAIN}/api/v2/users-by-email?email=${userData.email}`,
      {
        headers: {
          Authorization: `Bearer ${config.AUTH0_MANAGEMENT_API_ACCESS_TOKEN}`,
        },
      }
    );

    if (existingUserResponse.data.length > 0) {
      // Usuário já existe
      return existingUserResponse.data[0];
    } else {
      // Usuário não existe, criar um novo
      return await createAuth0User(userData);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Erro ao verificar ou criar usuário no Auth0:",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Erro desconhecido ao verificar ou criar usuário no Auth0:",
        error
      );
    }
    return null;
  }
};
