import React, { useCallback, useEffect, useRef, useState } from "react";
import { Heading, Stack, useToast, useMediaQuery } from "@chakra-ui/react";
import InputMask from "react-input-mask";
import { ChevronRight, Lock, Mail, Phone } from "react-feather";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { FormHandles } from "@unform/core";
import TextInput from "@components/shared/TextInput";
import { useAuth } from "hooks/auth";
import getValidationErrors from "utils/getValidationErrors";
import parseAuthErrors from "utils/parseAuthErrors";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import createUser from "@functions/auth/createUser";

interface FormData {
  email: string;
  password: string;
  passwordConfirm: string;
  phone: string;
}

const CreateAccount = () => {
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<FormHandles>();
  const { user, signIn } = useAuth();
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
          password: Yup.string()
            .min(6, "A senha precisa ter pelo menos 6 caracteres.")
            .required("Senha é obrigatória"),
          confirmPassword: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "As senhas devem ser iguais."
          ),
          phone: Yup.string()
            .min(15, "O telefone deve ser um número válido")
            .required("O número de telefone é obrigatório"),
        });

        await schema.validate(formData, { abortEarly: false });
        const { email, password, phone } = formData;

        await createUser({ email, password, phone });

        await signIn({ email, password });

        push("/dashboard");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          formRef.current?.setErrors(validationErrors);
          return;
        }
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
    [push, toast, signIn]
  );

  return (
    <>
      <main className="flex flex-col items-center justify-center flex-1 ">
        <Stack spacing={4} className="max-w-96">
          <Heading as="h1" size={isLargerThan750 ? "2xl" : "3xl"} mb={4}>
            Criar conta
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
              pr="4.5rem"
              placeholder="E-mail"
            />
            <TextInput
              name="password"
              leftIcon={<Lock size={20} strokeWidth="1.7" />}
              showPasswordButton
              pr="4.5rem"
              type="text"
              placeholder="Senha"
            />
            <TextInput
              name="confirmPassword"
              leftIcon={<Lock size={20} strokeWidth="1.7" />}
              showPasswordButton
              pr="4.5rem"
              type="text"
              placeholder="Confirme sua senha"
            />
            <TextInput
              name="phone"
              leftIcon={<Phone size={20} strokeWidth="1.7" />}
              variant="outline"
              pr="4.5rem"
              type="text"
              placeholder="Telefone"
              as={InputMask}
              mask="(99) 99999-9999"
            />
            <ButtonPrimary icon={<ChevronRight />} isLoading={isLoading}>
              Criar conta
            </ButtonPrimary>
          </Form>
        </Stack>
      </main>
    </>
  );
};

export default CreateAccount;
