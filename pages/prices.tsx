import React, { useCallback, useEffect, useState } from "react";
import LandingHeader from "@components/shared/LandingHeader";
import { Heading, useMediaQuery, useToast } from "@chakra-ui/react";
import { Check } from "react-feather";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import { useRouter } from "next/router";
import influencersList from "@JSON/influencersList";

interface CodeData {
  name: string;
  discount: number;
}

const Prices = () => {
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const router = useRouter();
  const toast = useToast();
  const [codeData, setCodeData] = useState<CodeData>({ name: "", discount: 0 });

  useEffect(() => {
    const { code } = router.query;

    if (code) {
      const data = influencersList[code as string];
      if (data) {
        setCodeData(data);
      }
    }
  }, [router]);

  const handleNavigate = useCallback(() => {
    router.push("/login");
    toast({
      title: "Acesse sua conta para poder fazer sua assinatura!",
      position: "top",
      status: "info",
      isClosable: true,
      duration: 5000,
    });
  }, [router, toast]);
  return (
    <div className="relative flex flex-col overflow-hidden">
      {isLargerThan750 && <LandingHeader />}
      <div className="flex flex-col items-center justify-center h-screen mx-4 overflow-hidden">
        <div className="flex flex-col items-center justify-center">
          {codeData.name && (
            <Heading as="h2" size="xl" fontWeight="semibold" className="mb-8">
              Promoção de lançamento com {codeData.name}!
            </Heading>
          )}
          <Heading as="h1" size="2xl">
            Um preço que cabe no seu bolso!
          </Heading>
          <span className="m-2 text-lg font-medium text-light-gray">
            Você tem 7 dias de graça para poder testar o Mestre de Obra
          </span>
        </div>

        <div className="flex flex-col items-center justify-center px-8 py-4 mt-8 border border-black rounded-md">
          <Heading as="h2">Plano mensal</Heading>
          <div className="mt-4">
            {/* <span className="mr-2 text-lg font-medium">De</span>
            <span className="text-5xl font-extrabold line-through text-lighter-gray">
              $29
            </span>
            <span className="mx-2 text-lg font-medium">por apenas</span> */}
            <span className="text-6xl font-extrabold">
              ${29 - codeData.discount}
            </span>
            <span className="text-lg font-extrabold">/mês</span>
          </div>
          <ul className="mt-4">
            <li className="flex text-lg font-medium">
              <Check className="mr-2" />
              Uploads ilimitados
            </li>
            <li className="flex text-lg font-medium">
              <Check className="mr-2" />
              Acessivel de qualquer lugar
            </li>
            <li className="flex text-lg font-medium">
              <Check className="mr-2" />5 membros por projeto
            </li>
            <li className="flex text-lg font-medium">
              <Check className="mr-2" />3 projetos
            </li>
          </ul>
          <ButtonPrimary
            className="justify-center text-xl font-bold"
            onClick={handleNavigate}>
            Assinar
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default Prices;
