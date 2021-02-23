import { Box, Button, useToast } from "@chakra-ui/react";
import LoadingSpinner from "@components/shared/LoadingSpinner";
import { firestore, functions } from "@firebase";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import api from "services/api";

const Payment: React.FC = () => {
  const { user } = useAuth();
  const { push } = useRouter();
  const [projects, setProjects] = useState([]);
  const toast = useToast();
  const [fileLoading, setFileLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const submitFileForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setFileLoading(true);

      try {
        const docRef = await firestore
          .collection("users")
          .doc(user.uid)
          .collection("checkout_sessions")
          .add({
            price: "price_1HZhqOBmGrCAWM3tGagLpxQJ",
            success_url: "http://localhost:3000/upload",
            cancel_url: "http://localhost:3000/dashboard",
          });

        docRef.onSnapshot(async (snap) => {
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
            // We have a session, let's redirect to Checkout
            // Init Stripe
            const stripe = await loadStripe(
              process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
            );
            await stripe.redirectToCheckout({ sessionId });
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
      push("/");
      return;
    }

    if (user.isSubscribed) {
      setIsPageLoading(true);
      pushSubscribersToPortal();
    }

    setProjects(user.projects);
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
