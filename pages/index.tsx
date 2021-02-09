import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  Link as UiLink,
  useToast,
} from "@chakra-ui/react";
import { FiChevronRight, FiLock, FiMail } from "react-icons/fi";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useRouter } from "next/router";

import { FormHandles } from "@unform/core";
import TextInput from "@components/LogIn/TextInput";
import { useAuth } from "hooks/auth";
import getValidationErrors from "utils/getValidationErrors";
import parseAuthErrors from "utils/parseAuthErrors";

interface FormData {
  email: string;
  password: string;
}

const Home: React.FC = () => {
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
      <Box bg="white" minW={350} p={8} boxShadow="md" borderRadius="md">
        <Stack spacing={4}>
          <Heading mb={8}>Log in</Heading>
          <Form
            ref={formRef}
            onSubmit={handleFormSubmit}
            className="flex flex-col items-end">
            <TextInput
              name="email"
              leftIcon={<FiMail />}
              variant="outline"
              pr="4.5rem"
              type="text"
              placeholder="E-mail"
            />
            <TextInput
              name="password"
              leftIcon={<FiLock />}
              showPasswordButton
              variant="outline"
              pr="4.5rem"
              type="text"
              placeholder="Senha"
            />
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
              rightIcon={<FiChevronRight />}>
              Entrar
            </Button>
          </Form>
        </Stack>
      </Box>
      <UiLink mt={2} fontSize="sm" color="gray.500">
        Esqueci minha senha
      </UiLink>
      <Text fontSize="sm" color="gray.500">
        ou
      </Text>
      <Button mt="4" colorScheme="yellow" rightIcon={<FiChevronRight />}>
        Criar uma conta
      </Button>
    </main>
  );
};

export default Home;
