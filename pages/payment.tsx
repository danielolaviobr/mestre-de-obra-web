import {
  Box,
  Button,
  Heading,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import Menu from "@components/shared/Menu";
import { auth, firestore, functions } from "@firebase";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import api from "services/api";

const Payment: React.FC = () => {
  const { user } = useAuth();
  const { push } = useRouter();
  const [projects, setProjects] = useState([]);
  const toast = useToast();
  const [fileLoading, setFileLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const userEmailInputRef = useRef<HTMLInputElement>();

  const handleProjectChange = useCallback((event) => {
    setSelectedProject(event.target.value);
  }, []);

  const testSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFileLoading(true);
    async function getCustomClaimRole() {
      await auth.currentUser.getIdToken(true);
      const decodedToken = await auth.currentUser.getIdTokenResult();
      return decodedToken.claims.stripeRole;
    }

    const functionRef = functions.httpsCallable(
      "ext-firestore-stripe-subscriptions-createPortalLink"
    );
    const { data } = await functionRef({ returnUrl: window.location.origin });
    window.location.assign(data.url);

    // const val = await getCustomClaimRole();
    console.log(val);
    setFileLoading(false);
  };

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
            // Show an error to your customer and inspect
            // your Cloud Function logs in the Firebase console.
            alert(`An error occurred: ${error.message}`);
          }

          if (sessionId) {
            // We have a session, let's redirect to Checkout
            // Init Stripe
            const stripe = await loadStripe(
              "pk_test_51HN9fvBmGrCAWM3tpFieM9kk5GcSwPnHiXRwgfjnH4xT2UxNSU27haffb8z93l1qkXF3zeyNuOi5L1JedKVA5kMS00Qm3gm17L"
            );
            console.log("redirecting");
            await stripe.redirectToCheckout({ sessionId });
          }
        });
        //   const functionRef = functions.httpsCallable(
        //     "ext-firestore-stripe-subscriptions-createPortalLink"
        //   );
        //   const { data } = await functionRef({
        //     returnUrl: window.location.origin,
        //   });
        //   console.log(data);
        // window.location.assign(data.url);
      } catch (err) {
        console.log(err);
      } finally {
        setFileLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user === undefined) {
      push("/");
      return;
    }

    setProjects(user.projects);
  }, [user, push]);

  return (
    <main className="flex items-center justify-center flex-1 min-h-screen min-w-screen">
      <Menu />
      <main className="flex items-center justify-center m">
        <Box
          className="flex flex-col px-4 py-6 rounded"
          bg="white"
          boxShadow="base">
          <form onSubmit={testSubmit}>
            {/* <Heading as="h1" size="lg" mb={4}>
              Adicionar um membro
            </Heading>
            <Select
              mb={4}
              placeholder="Selecion o projeto"
              variant="filled"
              onChange={handleProjectChange}>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </Select>
            <Input
              ref={userEmailInputRef}
              mb={4}
              placeholder="E-mail do usuário"
            /> */}
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
