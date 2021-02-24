import React, { useCallback, useEffect, useRef, useState } from "react";
import { Heading, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { ArrowLeft, Power } from "react-feather";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import resetPassword from "@functions/auth/resetPassword";
import SignOutAlert from "./SignOutAlert";

const Header = () => {
  const { user } = useAuth();
  const [isIos, setIsIos] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [currentPath, setCurrentPath] = useState("dashboard");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const alertRef = useRef();
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");

  const checkIos = useCallback(() => {
    if (typeof window !== "undefined") {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    }
    return false;
  }, []);

  useEffect(() => {
    setIsIos(checkIos());
    setCurrentPath(router.pathname.split("/")[1]);
    if (user) {
      setIsAnonymous(user.isAnonymous);
    }
  }, [checkIos, user, router]);

  return (
    <div
      className={`fixed top-0 z-10 flex items-center justify-center w-screen bg-black shadow-sm ${
        isIos && " standalone:pb-4 standalone:h-20 "
      } h-14 pt-safe-top`}>
      {isAnonymous && !isLargerThan750 && currentPath === "pdf" && (
        <button
          className="absolute left-0 ml-8 focus:outline-none"
          onClick={() => router.push("/dashboard")}>
          <ArrowLeft size={22} color="white" />
        </button>
      )}
      <Heading color="white" className="my-8 tracking-tighter">
        Mestre de Obra
      </Heading>
      {user && (
        <>
          <button
            className="absolute right-0 mr-8 focus:outline-none"
            onClick={onOpen}>
            <Power size={22} color="white" />
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
