import React, { useRef } from "react";
import { Heading, useDisclosure } from "@chakra-ui/react";
import { Power } from "react-feather";
import { useAuth } from "hooks/auth";
import SignOutAlert from "./SignOutAlert";

const Header = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const alertRef = useRef();
  return (
    <div className="fixed top-0 z-10 flex items-center justify-center w-screen bg-black shadow-sm standalone:pb-4 h-14 standalone:h-20 pt-safe-top">
      <Heading color="white" className="my-8 tracking-tighter">
        Mestre de Obra
      </Heading>
      {user && (
        <>
          <button
            className="absolute right-0 mr-8 focus:outline-none"
            onClick={onOpen}>
            <Power size={20} color="white" />
          </button>
          {isOpen && (
            <SignOutAlert ref={alertRef} isOpen={isOpen} onClose={onClose} />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
