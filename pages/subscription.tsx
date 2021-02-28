import { Box, Button, useToast } from "@chakra-ui/react";
import LoadingSpinner from "@components/shared/LoadingSpinner";
import { functions } from "@firebase";
import createTransaction from "@functions/firestore/createTransaction";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, { FormEvent, useCallback, useEffect, useState } from "react";

const Payment: React.FC = () => {
  const { user } = useAuth();
  const { push } = useRouter();
  const toast = useToast();
  const [fileLoading, setFileLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const submitFileForm = useCallback(
    async (e: FormEvent) => {
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
          console.log(sessionId);
          if (sessionId) {
            const stripe = await loadStripe(
              process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
            );
            await stripe.redirectToCheckout({
              sessionId,
              cancelUrl: `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
              successUrl: `${process.env.NEXT_PUBLIC_API_URL}/dashboard`,
              locale: "pt-BR",
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

  const pushSubscribersToPortal = useCallback(async () => {
    const functionRef = functions.httpsCallable(
      "ext-firestore-stripe-subscriptions-createPortalLink"
    );
    const { data } = await functionRef({ returnUrl: window.location.origin });
    push(data.url);
  }, [push]);

  useEffect(() => {
    if (user === undefined) {
      push("/login");
      return;
    }

    if (user.isSubscribed) {
      setIsPageLoading(true);
      pushSubscribersToPortal();
    }
  }, [user, push, pushSubscribersToPortal]);

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <LoadingSpinner
          style={{ filter: "invert(100%)", height: "30px", width: "30px" }}
        />
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center flex-1 min-h-screen min-w-screen">
      <main className="flex items-center justify-center">
        <Box
          className="flex flex-col px-4 py-6 rounded"
          bg="white"
          boxShadow="base">
          <form onSubmit={submitFileForm}>
            <Button isLoading={fileLoading} colorScheme="blue" type="submit">
              Subscribe
            </Button>
          </form>
        </Box>
      </main>
    </main>
  );
};

export default Payment;
