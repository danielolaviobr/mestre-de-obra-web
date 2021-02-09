import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import "tailwindcss/tailwind.css";
import HookspProvider from "hooks";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <HookspProvider>
        <main className="flex flex-1 h-full min-h-screen overflow-hidden bg-blue-200">
          <Component {...pageProps} />
        </main>
      </HookspProvider>
    </ChakraProvider>
  );
}

export default MyApp;
