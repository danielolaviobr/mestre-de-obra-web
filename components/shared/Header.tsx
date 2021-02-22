import React, { useCallback, useEffect, useRef, useState } from "react";
import { Heading, useDisclosure } from "@chakra-ui/react";
import { Power } from "react-feather";
import { useAuth } from "hooks/auth";
import SignOutAlert from "./SignOutAlert";

const Header = () => {
  const { user } = useAuth();
  const [isIos, setIsIos] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const alertRef = useRef();

  const checkIos = useCallback(() => {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    }
    return false;
  }, []);

  useEffect(() => {
    setIsIos(checkIos());
  }, [checkIos]);

  return (
    <div
      className={`fixed top-0 z-10 flex items-center justify-center w-screen bg-black shadow-sm ${
        isIos && " standalone:pb-4 standalone:h-20 "
      } h-14 pt-safe-top`}
      style={{}}>
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
