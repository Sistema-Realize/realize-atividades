import { Inter, Roboto } from "next/font/google";

// Configuração de fontes do Google (alternativas/fallback)
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

// Função para obter as variáveis de fonte para uso no layout
export function getFontVariables() {
  return `${inter.variable} ${roboto.variable}`;
}

// Definindo as variáveis CSS para Adobe Fonts
export const adobeFontsVariables = {
  p22MackinacPro: "p22-mackinac-pro, serif",
};
