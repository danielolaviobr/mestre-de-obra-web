import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import "tailwindcss/tailwind.css";
import HookspProvider from "hooks";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <HookspProvider>
        <Component {...pageProps} />
      </HookspProvider>
    </ChakraProvider>
  );
}

export default MyApp;
