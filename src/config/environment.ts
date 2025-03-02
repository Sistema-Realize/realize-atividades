export const config = {
  // Configurações do Auth0
  AUTH0_SECRET: process.env.AUTH0_SECRET || "uma-string-segura",
  AUTH0_BASE_URL: process.env.AUTH0_BASE_URL || "http://localhost:3000",
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || "",
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || "",
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || "",
  AUTH0_MANAGEMENT_API_ACCESS_TOKEN:
    process.env.AUTH0_MANAGEMENT_API_ACCESS_TOKEN || "",

  AUTH0_DOMAIN:
    process.env.AUTH0_DOMAIN || process.env.AUTH0_ISSUER_BASE_URL || "",

  // Configurações do Asaas API
  ASAAS_API_KEY: process.env.ASAAS_API_KEY || "",
  ASAAS_ACCESS_TOKEN: process.env.ASAAS_ACCESS_TOKEN || "",
  NEXT_PUBLIC_ASAAS_API_URL:
    process.env.NEXT_PUBLIC_ASAAS_API_URL || "https://api-sandbox.asaas.com/v3",

  // Configuração pública do Next.js
  NEXT_PUBLIC_BASE_URL:
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
};
