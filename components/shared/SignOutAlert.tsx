import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from "@chakra-ui/react";
import { useAuth } from "hooks/auth";
import React from "react";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";

interface SignOutAlertProps {
  ref: React.RefObject<undefined>;
  onClose(): void;
  isOpen: boolean;
}

const SignOutAlert = ({ ref, onClose, isOpen }: SignOutAlertProps) => {
  const { signOut } = useAuth();
  const handleSignOut = () => {
    onClose();
    signOut();
  };
  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={ref}
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
            ref={ref}
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
