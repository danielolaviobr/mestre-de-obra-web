import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";

interface SignOutAlertProps {
  onClose(): void;
  isOpen: boolean;
}

const SignOutAlert = ({ onClose, isOpen }: SignOutAlertProps) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const cancelRef = useRef();
  const handleSignOut = async () => {
    router.push("/");
    onClose();
    await signOut();
  };
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered>
      <AlertDialogOverlay />

      <AlertDialogContent className="m-4">
        <AlertDialogHeader>Você deseja sair?</AlertDialogHeader>
        <AlertDialogCloseButton className="focus:outline-none" />
        <AlertDialogFooter>
          <ButtonPrimary
            type="button"
            ref={cancelRef}
            onClick={onClose}
            className="mx-2">
            Não
          </ButtonPrimary>
          <ButtonSecondary
            type="button"
            onClick={handleSignOut}
            className="mx-2">
            Sim
          </ButtonSecondary>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignOutAlert;
