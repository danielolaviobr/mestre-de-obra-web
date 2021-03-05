import React from "react";
import { Heading } from "@chakra-ui/react";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";

const LadingPage = () => {
  const router = useRouter();

  return (
    <div className="relative flex flex-col overflow-hidden">
      <div className="flex items-center justify-center h-screen mx-4 overflow-hidden">
        <div className="flex flex-col items-start ml-56 mr-auto -mt-48">
          <motion.div
            style={{ width: 500 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}>
            <Heading as="h1" size="4xl" mb={6}>
              Seus projetos em um só lugar
            </Heading>
            <span className="text-light-gray">
              Mestre de Obra é uma plataforma mais modernar e mais simples para
              gerir e compartilhar seus projetos. Projeto para que qualquer
              pessoa possa usar.
            </span>
          </motion.div>
          <motion.div
            style={{ width: 192, marginTop: 48 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}>
            <ButtonPrimary
              className="justify-center text-xl"
              onClick={() => router.push("/prices")}>
              Teste de graça
            </ButtonPrimary>
          </motion.div>
        </div>
        <div className="relative flex w-full h-screen ml-12 mr-16 mt-44">
          <motion.div
            className="absolute"
            initial={{ top: 32 }}
            animate={{ top: -8 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 4,
            }}>
            <Image
              src="/assets/Macbook.png"
              width={2190}
              height={1940}
              alt="Macbook"
              priority
            />
          </motion.div>
          <motion.div
            className="absolute right-12"
            initial={{ top: 0 }}
            animate={{ top: 16 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 3,
            }}>
            <Image
              src="/assets/iPhone.png"
              width={2190}
              height={1940}
              alt="iPhone"
              priority
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LadingPage;
