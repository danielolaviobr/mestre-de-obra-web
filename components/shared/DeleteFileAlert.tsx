import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useAuth } from "hooks/auth";
import React from "react";
import ButtonPrimary from "../shared/ButtonPrimary";
import ButtonSecondary from "../shared/ButtonSecondary";

interface DeleteFileAlertProps {
  ref: React.RefObject<undefined>;
  onClose(): void;
  isOpen: boolean;
  fileName: string;
  action(): void;
}

const DeleteFileAlert = ({
  ref,
  onClose,
  isOpen,
  fileName,
  action,
}: DeleteFileAlertProps) => {
  const handleDeleteFile = () => {
    onClose();
    action();
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
        <AlertDialogHeader>Deleter arquivo?</AlertDialogHeader>
        <AlertDialogCloseButton className="focus:outline-none" />
        <AlertDialogBody>
          Você deseja deletar o arquivo {fileName}? Essa ação é irreversivel e
          não pode ser desfeita.
        </AlertDialogBody>
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
            onClick={handleDeleteFile}
            className="mx-2">
            Sim
          </ButtonSecondary>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteFileAlert;
