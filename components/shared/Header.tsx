import React from "react";
import { Heading } from "@chakra-ui/react";
import { RefreshCw } from "react-feather";

const Header = () => (
  <div className="fixed top-0 z-10 flex items-center justify-center w-screen pb-4 bg-blue-500 shadow-sm h-11 standalone:h-20 pt-safe-top">
    <Heading color="white">Mestre de Obra</Heading>
    <RefreshCw
      color="white"
      size={20}
      className="absolute right-0 mx-6"
      onClick={() => {
        alert("hey");
      }}
    />
  </div>
);

export default Header;
