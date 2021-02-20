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
        <AlertDialogCloseButton />
        {/* <AlertDialogBody>
        Are you sure you want to discard all of your notes? 44 words will be
        deleted.
      </AlertDialogBody> */}
        <AlertDialogFooter>
          {/* <Button ref={ref} onClick={onClose}>
          Não
        </Button> */}
          <ButtonPrimary type="button" ref={ref} onClick={onClose}>
            Não
          </ButtonPrimary>
          <ButtonSecondary type="button" onClick={signOut}>
            Sim
          </ButtonSecondary>
          {/* <Button colorScheme="red" ml={3}>
          Sim
        </Button> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SignOutAlert;
