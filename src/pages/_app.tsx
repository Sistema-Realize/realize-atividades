import { UserProvider } from "@auth0/nextjs-auth0/client";
import { AppProps } from "next/app";
import "../styles/globals.css";

import AdobeFonts from "@/components/AdobeFonts";
import { getFontVariables } from "@/config/fonts";

function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AdobeFonts />
      <main className={getFontVariables()}>
        <Component {...pageProps} />
      </main>
    </UserProvider>
  );
}

export default App;
