import React, { useCallback, useRef, useState } from "react";
import { Heading, Stack, useToast, useMediaQuery } from "@chakra-ui/react";
import { ChevronRight, Lock } from "react-feather";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { FormHandles } from "@unform/core";
import TextInput from "@components/shared/TextInput";
import getValidationErrors from "utils/getValidationErrors";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import changePassword from "@functions/auth/changePassword";

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<FormHandles>();
  const { push, query } = useRouter();
  const toast = useToast();

  const handleFormSubmit = useCallback(
    async (formData: FormData) => {
      setIsLoading(true);
      const { oobCode } = query;
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

        await changePassword({ code: oobCode as string, password });

        toast({
          position: "top",
          title: "Senha alterada",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        push("/");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          formRef.current?.setErrors(validationErrors);
          return;
        }
        toast({
          position: "top",
          title: "Erro ao alterar sua senha",
          description:
            "Ocorreu um erro inesperado ao alterar a sua senha, favor tente novamente.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [push, toast, query]
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
