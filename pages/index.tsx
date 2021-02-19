import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  Link as UiLink,
  useToast,
  useMediaQuery,
} from "@chakra-ui/react";
import { ChevronRight, Lock, Mail } from "react-feather";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useRouter } from "next/router";

import { FormHandles } from "@unform/core";
import TextInput from "@components/shared/TextInput";
import { useAuth } from "hooks/auth";
import getValidationErrors from "utils/getValidationErrors";
import parseAuthErrors from "utils/parseAuthErrors";
import Link from "next/link";
import Loading from "../public/assets/loading.svg";
import ButtonPrimary from "@components/shared/ButtonPrimary";

interface FormData {
  email: string;
  password: string;
}

const Home: React.FC = () => {
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<FormHandles>();
  const { signIn, user } = useAuth();
  const { push } = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (user) {
      push("/dashboard");
    }
  }, [user, push]);

  const handleFormSubmit = useCallback(
    async (formData: FormData) => {
      setIsLoading(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("Digite um e-mail válido"),
          password: Yup.string().required("Senha é obrigatória"),
        });

        await schema.validate(formData, { abortEarly: false });
        const { email, password } = formData;

        await signIn({ email, password });

        push("/dashboard");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          formRef.current?.setErrors(validationErrors);
          return;
        }
        const { title, description } = parseAuthErrors(err.message);

        toast({
          position: "top",
          title,
          description,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [signIn, push, toast]
  );

  return (
    <main className="flex flex-col items-center justify-center flex-1 ">
      {/* <Box bg="white" minW={350} p={8} boxShadow="md" borderRadius="md"> */}
      <Stack spacing={4} className="w-96">
        <Heading as="h1" size={isLargerThan750 ? "2xl" : "3xl"} mb={4}>
          Log in
        </Heading>
        <Form
          ref={formRef}
          onSubmit={handleFormSubmit}
          className="flex flex-col items-end">
          <TextInput
            name="email"
            type="text"
            autoCapitalize="off"
            leftIcon={<Mail size={20} strokeWidth="1.7" />}
            variant="outline"
            pr="4.5rem"
            placeholder="E-mail"
          />
          <TextInput
            name="password"
            leftIcon={<Lock size={20} strokeWidth="1.7" />}
            showPasswordButton
            variant="outline"
            pr="4.5rem"
            type="text"
            placeholder="Senha"
          />
          {/* <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              rightIcon={<ChevronRight />}>
              Entrar
            </Button> */}
          <ButtonPrimary icon={<ChevronRight />} isLoading={isLoading}>
            Entrar
          </ButtonPrimary>
        </Form>
      </Stack>
      {/* </Box> */}
      <div className="flex flex-col items-center mt-4 w-96">
        {/* <UiLink href="/upload" as={Link} mt={8} fontSize="sm" color="black">
        Esqueci minha senha
      </UiLink> */}
        <span className="font-medium hover:underline">
          <Link href="/">Esqueci minha senha</Link>
        </span>
        <Text fontSize="sm" color="black" className="mt-2 font-medium">
          ou
        </Text>
        <button type="button" className="border-btn">
          Criar uma conta
          <ChevronRight />
        </button>
        {/* <Button mt="4" colorScheme="yellow" rightIcon={<ChevronRight />}>
          Criar uma conta
        </Button> */}
      </div>
    </main>
  );
};

export default Home;
