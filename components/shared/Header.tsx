import React, { useCallback, useEffect, useState } from "react";
import { Heading, useDisclosure, useMediaQuery } from "@chakra-ui/react";
import { ArrowLeft, Power } from "react-feather";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import SignOutAlert from "./SignOutAlert";

const Header = () => {
  const { user } = useAuth();
  const [isIos, setIsIos] = useState(true);
  const [currentPath, setCurrentPath] = useState("dashboard");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
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
    setCurrentPath(router?.pathname.split("/")[1]);
  }, [checkIos, router]);

  return (
    <div
      className={`fixed top-0 z-10 flex items-center justify-center w-screen bg-black shadow-sm ${
        isIos && " standalone:pb-4 standalone:h-20 "
      } h-14 pt-safe-top`}>
      {!isLargerThan750 && currentPath === "pdf" && (
        <button
          className="absolute left-0 ml-8 focus:outline-none"
          onClick={() => router.push("/dashboard")}>
          <ArrowLeft size={22} color="white" />
        </button>
      )}
      <Heading color="white" className="my-8 tracking-tighter">
        <Link
          href={
            currentPath === "login" || currentPath === "create-account"
              ? "/"
              : "/dashboard"
          }>
          Mestre de Obra
        </Link>
      </Heading>
      {user && (
        <>
          <button
            className="absolute right-0 mr-8 focus:outline-none"
            onClick={onOpen}>
            <Power size={22} color="white" />
          </button>
          {isOpen && <SignOutAlert isOpen={isOpen} onClose={onClose} />}
        </>
      )}
    </div>
  );
};

export default Header;
