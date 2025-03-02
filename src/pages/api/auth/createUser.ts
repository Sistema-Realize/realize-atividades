import axios from "axios";
import { config } from "../../../config/environment";

// Definir tipos específicos para os parâmetros
interface UserData {
  email: string;
  password: string;
  connection: string;
  // Outros campos conforme necessário
}

// Função para criar um usuário no Auth0
const createAuth0User = async (userData: UserData) => {
  try {
    const response = await axios.post(
      `${config.AUTH0_ISSUER_BASE_URL}/api/v2/users`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${config.AUTH0_MANAGEMENT_API_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário no Auth0:", error);
    return null;
  }
};

// Função para verificar ou criar um usuário no Auth0
const findOrCreateAuth0User = async (userData: UserData) => {
  try {
    // Verificar se o usuário já existe
    const existingUserResponse = await axios.get(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users-by-email?email=${userData.email}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH0_MANAGEMENT_API_ACCESS_TOKEN}`,
        },
      }
    );

    if (existingUserResponse.data.length > 0) {
      // Usuário já existe, retornar o primeiro encontrado
      return existingUserResponse.data[0];
    } else {
      // Usuário não existe, criar um novo
      return await createAuth0User(userData);
    }
  } catch (error) {
    console.error("Erro ao verificar ou criar usuário no Auth0:", error);
    return null;
  }
};

// Exemplo de uso
const userData: UserData = {
  email: "johndoe@example.com",
  password: "securepassword",
  connection: "Username-Password-Authentication",
  // Outros dados do usuário
};

findOrCreateAuth0User(userData).then((user) => {
  if (user) {
    console.log("Usuário encontrado ou criado com sucesso:", user);
    // A lógica de criação de pagamento foi movida para outro lugar
  }
});
