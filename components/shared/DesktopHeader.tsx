import React, { useEffect, useState } from "react";
import { Heading, useDisclosure } from "@chakra-ui/react";
import { Power } from "react-feather";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { AnimateSharedLayout, motion } from "framer-motion";
import SignOutAlert from "./SignOutAlert";

const DesktopHeader = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  useEffect(() => {
    const currentPage = router.pathname.split("/")[1];
    setActivePage(currentPage);
  }, [router]);

  useEffect(() => {
    if (user) {
      setIsAnonymous(user.isAnonymous);
    }
  }, [user]);

  return (
    <div
      className={`fixed top-0 z-10 flex items-center justify-center w-screen pl-8 bg-black h-14 pt-safe-top ${
        (activePage === "" ||
          activePage === "prices" ||
          activePage === "login" ||
          activePage === "create-account") &&
        " hidden"
      }`}>
      {isAnonymous || !user ? (
        <Link
          href={
            activePage === "login" || activePage === "create-account"
              ? "/"
              : "/dashboard"
          }>
          <Heading
            color="white"
            className="my-8 tracking-tighter cursor-pointer">
            Mestre de Obra
          </Heading>
        </Link>
      ) : (
        <AnimateSharedLayout>
          <div className="flex justify-self-start">
            <div className="mr-3 text-lg font-medium text-white">
              <Link href="/dashboard">
                <span className="cursor-pointer">
                  Início
                  {activePage === "dashboard" && (
                    <motion.div
                      className="w-full h-1 bg-white rounded-lg"
                      layoutId="selected"
                    />
                  )}
                </span>
              </Link>
            </div>
            <div className="mr-3 text-lg font-medium text-white">
              <Link href="/add-viewer">
                <span className="cursor-pointer">
                  Adicionar membro
                  {activePage === "add-viewer" && (
                    <motion.div
                      className="w-full h-1 bg-white rounded-lg"
                      layoutId="selected"
                    />
                  )}
                </span>
              </Link>
            </div>
            <div className="mr-3 text-lg font-medium text-white">
              <Link href="/upload">
                <span className="cursor-pointer">
                  Enviar arquivos
                  {activePage === "upload" && (
                    <motion.div
                      className="w-full h-1 bg-white rounded-lg"
                      layoutId="selected"
                    />
                  )}
                </span>
              </Link>
            </div>
            <div className="mr-3 text-lg font-medium text-white">
              <Link href="/create-project">
                <span className="cursor-pointer">
                  Criar projeto
                  {activePage === "create-project" && (
                    <motion.div
                      className="w-full h-1 bg-white rounded-lg"
                      layoutId="selected"
                    />
                  )}
                </span>
              </Link>
            </div>

            <div className="mr-3 text-lg font-medium text-white">
              <Link href="/subscription">
                <span className="cursor-pointer">
                  Assinatura
                  {activePage === "subscription" && (
                    <motion.div
                      className="w-full h-1 bg-white rounded-lg"
                      layoutId="selected"
                    />
                  )}
                </span>
              </Link>
            </div>
          </div>
        </AnimateSharedLayout>
      )}
      {user && (
        <>
          <button
            className="absolute right-0 mr-8 focus:outline-none"
            onClick={onOpen}>
            <Power size={20} color="white" />
          </button>
          {isOpen && <SignOutAlert isOpen={isOpen} onClose={onClose} />}
        </>
      )}
    </div>
  );
};

export default DesktopHeader;
