import React from "react";
import { Heading, useDisclosure } from "@chakra-ui/react";
import { AlignLeft, RefreshCw, X } from "react-feather";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div className="fixed top-0 z-10 flex items-center justify-center w-screen pb-4 bg-black shadow-sm h-11 standalone:h-20 pt-safe-top">
        <Heading color="white" className="my-8 tracking-tighter">
          Mestre de Obra
        </Heading>
      </div>
    </>
  );
};

export default Header;
