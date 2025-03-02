import axios from "axios";

export async function getUserSession() {
  try {
    const { data } = await axios.get("/api/auth/me");
    return data.user; // Retorna os dados do usuário autenticado
  } catch (error) {
    console.error("Erro ao obter sessão do usuário:", error);
    return null;
  }
}
