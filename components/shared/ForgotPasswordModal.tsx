import React, { useCallback, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
} from "@chakra-ui/react";
import { ChevronRight, Mail } from "react-feather";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import getValidationErrors from "utils/getValidationErrors";
import resetPassword from "@functions/auth/resetPassword";
import parseAuthErrors from "utils/parseAuthErrors";
import TextInput from "./TextInput";
import ButtonPrimary from "./ButtonPrimary";

type ForgotPasswordModalProps = {
  isOpen: boolean;
  onClose(): void;
};

type FormData = {
  email: string;
};

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const initialRef = useRef();
  const formRef = useRef<FormHandles>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = useCallback(
    async (formData: FormData) => {
      setIsLoading(true);
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("Digite um e-mail válido"),
        });

        await schema.validate(formData, { abortEarly: false });
        const { email } = formData;
        await resetPassword(email);
        toast({
          position: "top",
          title: "E-mail enviado",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
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
    [toast, onClose]
  );

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered>
      <ModalOverlay />
      <ModalContent className="mx-4">
        <ModalHeader>Recuperar sua senha</ModalHeader>
        <ModalCloseButton />
        <Form ref={formRef} onSubmit={handleFormSubmit}>
          <ModalBody pb={6}>
            <TextInput
              ref={initialRef}
              placeholder="E-mail"
              name="email"
              leftIcon={<Mail size={20} strokeWidth="1.7" />}
            />
            <ButtonPrimary isLoading={isLoading} icon={<ChevronRight />}>
              Enviar
            </ButtonPrimary>
          </ModalBody>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default ForgotPasswordModal;
