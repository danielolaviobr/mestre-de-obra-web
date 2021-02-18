import { Heading } from "@chakra-ui/react";
import React from "react";

const Header = () => (
  <div className="fixed top-0 z-10 flex items-center justify-center w-screen pb-4 bg-blue-500 shadow-sm h-11 standalone:h-20 pt-safe-top">
    <Heading color="white">Mestre de Obra</Heading>
  </div>
);

export default Header;
