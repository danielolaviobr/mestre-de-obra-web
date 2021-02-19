import React from "react";
import { Heading } from "@chakra-ui/react";

const Header = () => (
  <header className="fixed top-0 z-10 flex items-center justify-center w-screen bg-black shadow-sm standalone:pb-4 h-14 standalone:h-20 pt-safe-top">
    <Heading color="white" className="my-8 tracking-tighter">
      Mestre de Obra
    </Heading>
  </header>
);

export default Header;
