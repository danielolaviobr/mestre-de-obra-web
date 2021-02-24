import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Heading,
  Stack,
  Text,
  useToast,
  useMediaQuery,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronRight, Lock, Mail } from "react-feather";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { FormHandles } from "@unform/core";
import TextInput from "@components/shared/TextInput";
import { useAuth } from "hooks/auth";
import getValidationErrors from "utils/getValidationErrors";
import ButtonPrimary from "@components/shared/ButtonPrimary";

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<FormHandles>();
  const { signIn, user } = useAuth();
  const { push } = useRouter();
  const toast = useToast();

  const handleFormSubmit = useCallback(
    async (formData: FormData) => {
      setIsLoading(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string()
            .min(6, "A senha precisa ter pelo menos 6 caracteres.")
            .required("Senha é obrigatória."),
          confirmPassword: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "As senhas devem ser iguais."
          ),
        });

        await schema.validate(formData, { abortEarly: false });
        const { password } = formData;

        push("/dashboard");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          formRef.current?.setErrors(validationErrors);
          console.log(validationErrors);
          Object.keys(validationErrors).forEach((error) => {
            toast({
              position: "top",
              title: "Erro de validação",
              description: validationErrors[error],
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });

          return;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [signIn, push, toast]
  );

  return (
    <main className="flex flex-col items-center justify-center flex-1 ">
      <Stack spacing={4} className="max-w-96">
        <Heading as="h1" size={isLargerThan750 ? "2xl" : "3xl"} mb={4}>
          Mudar senha
        </Heading>
        <Form
          ref={formRef}
          onSubmit={handleFormSubmit}
          className="flex flex-col items-end">
          <TextInput
            name="password"
            leftIcon={<Lock size={20} strokeWidth="1.7" />}
            showPasswordButton
            pr="4.5rem"
            type="text"
            placeholder="Nova senha"
          />
          <TextInput
            name="confirmPassword"
            leftIcon={<Lock size={20} strokeWidth="1.7" />}
            showPasswordButton
            pr="4.5rem"
            type="text"
            placeholder="Repita sua senha"
          />
          <ButtonPrimary icon={<ChevronRight />} isLoading={isLoading}>
            Salvar
          </ButtonPrimary>
        </Form>
      </Stack>
    </main>
  );
};

export default ResetPassword;
