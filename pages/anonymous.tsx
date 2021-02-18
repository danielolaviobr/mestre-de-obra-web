import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import { Phone } from "react-feather";
import InputMask from "react-input-mask";

import { useAuth } from "hooks/auth";
import TextInput from "@components/shared/TextInput";

interface FormData {
  phone: string;
}

const Anonymous: React.FC = () => {
  const { anonymousSignIn, user } = useAuth();
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
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
    [anonymousSignIn]
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
            <Button isLoading={isLoading} colorScheme="blue" type="submit">
              Entrar
            </Button>
          </Form>
        </Box>
      </main>
    </main>
  );
};

export default Anonymous;
