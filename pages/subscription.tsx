import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { Heading, useToast } from "@chakra-ui/react";
import { Check } from "react-feather";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import { useRouter } from "next/router";
import influencersList from "@JSON/influencersList";
import createTransaction from "@functions/firestore/createTransaction";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "hooks/auth";

interface CodeData {
  name: string;
  discount: number;
}

const Subscription = () => {
  const router = useRouter();
  const toast = useToast();
  const {user} = useAuth()
  const [codeData, setCodeData] = useState<CodeData>({ name: "", discount: 0 });
  const [fileLoading, setFileLoading] = useState(false);


  useEffect(() => {
    const { code } = router.query;

    if (code) {
      const data = influencersList[code as string];
      if (data) {
        setCodeData(data);
      }
    }
  }, [router]);

  const handleNavigate = useCallback(
    async (e: any) => {
      e.preventDefault();
      setFileLoading(true);

      try {
        const transaction = await createTransaction({
          uid: user.uid,
          productName: "Assinatura Mestre de Obra",
        });

        transaction.onSnapshot(async (snap) => {
          const { error, sessionId } = snap.data();
          if (error) {
            toast({
              position: "top",
              title: "Erro inesperado",
              description: `Erro: ${error.message}`,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
          if (sessionId) {
            const stripe = await loadStripe(
              process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
            );
            await stripe.redirectToCheckout({
              sessionId,
            });
          }
        });
      } catch (err) {
        toast({
          position: "top",
          title: "Erro na conexão",
          description:
            "Ocorreu um erro na conexão com nossos servidores, favor tentar novamente.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setFileLoading(false);
      }
    },
    [user, toast]
  );
  return (
    <div className="relative flex flex-col overflow-hidden">
      <div className="flex flex-col justify-center h-screen mx-4 -m-16 overflow-hidden">
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
            Você tem 30 dias de graça para poder testar o Mestre de Obra
          </span>
        </div>

        <div className="flex flex-col items-center justify-center px-8 py-4 mt-8 border border-black rounded-md">
          <Heading as="h2">Plano mensal</Heading>
          <div className="mt-4">
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
          <form onSubmit={handleNavigate}>

          <ButtonPrimary
            className="justify-center text-xl font-bold"
            // </form>onClick={handleNavigate}
            type="submit"
            isLoading={fileLoading}>
            Assinar
          </ButtonPrimary>
              </form>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
