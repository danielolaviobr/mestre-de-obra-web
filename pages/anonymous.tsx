import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Heading, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import { ChevronRight, Phone } from "react-feather";
import InputMask from "react-input-mask";

import { useAuth } from "hooks/auth";
import TextInput from "@components/shared/TextInput";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import parseAuthErrors from "utils/parseAuthErrors";

interface FormData {
  phone: string;
}

const Anonymous: React.FC = () => {
  const { anonymousSignIn, user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const formRef = useRef<FormHandles>();

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      setIsLoading(true);
      const { phone } = formData;
      try {
        await anonymousSignIn(phone);
      } catch (err) {
        const { title, description } = parseAuthErrors(err.code);

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
    [anonymousSignIn, toast]
  );

  useEffect(() => {
    if (user) {
      push("/dashboard");
    }
  }, [user, push]);

  return (
    <main className="flex items-center justify-center flex-1 min-h-screen min-w-screen">
      <main className="flex items-center justify-center">
        <Box
          className="flex flex-col px-4 py-6 rounded"
          bg="white"
          boxShadow="base">
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Heading as="h1" size="lg" mb={4}>
              Acessar Mestre de Obra
            </Heading>
            <TextInput
              name="phone"
              leftIcon={<Phone />}
              variant="outline"
              pr="4.5rem"
              type="text"
              placeholder="Telefone"
              as={InputMask}
              mask="(99) 99999-9999"
            />
            <ButtonPrimary isLoading={isLoading} icon={<ChevronRight />}>
              Entrar
            </ButtonPrimary>
          </Form>
        </Box>
      </main>
    </main>
  );
};

export default Anonymous;
