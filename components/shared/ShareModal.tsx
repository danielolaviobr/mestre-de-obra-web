import React from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import {
  FacebookMessengerShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import { Facebook, MessageCircle, Paperclip, Send } from "react-feather";
import ButtonSecondary from "./ButtonSecondary";

type ShareModalProps = {
  onClose(): void;
  isOpen: boolean;
};

const ShareModal: React.FC<ShareModalProps> = ({ onClose, isOpen }) => {
  const { onCopy } = useClipboard(
    `${process.env.NEXT_PUBLIC_API_URL}/anonymous`
  );
  const toast = useToast();

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xs">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Comparilhar</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={12}>
          <WhatsappShareButton
            url={`${process.env.NEXT_PUBLIC_API_URL}/anonymous`}
            title="Mestre de Obra"
            separator=" - "
            className="w-full">
            <ButtonSecondary
              type="button"
              onClick={onClose}
              icon={<MessageCircle />}>
              WhatsApp
            </ButtonSecondary>
          </WhatsappShareButton>
          <FacebookMessengerShareButton
            url={`${process.env.NEXT_PUBLIC_API_URL}/anonymous`}
            title="Mestre de Obra"
            appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}
            className="w-full">
            <ButtonSecondary
              type="button"
              onClick={onClose}
              icon={<Facebook />}>
              Messenger
            </ButtonSecondary>
          </FacebookMessengerShareButton>
          <TelegramShareButton
            url={`${process.env.NEXT_PUBLIC_API_URL}/anonymous`}
            title="Mestre de Obra"
            className="w-full">
            <ButtonSecondary type="button" onClick={onClose} icon={<Send />}>
              Telegram
            </ButtonSecondary>
          </TelegramShareButton>
          <ButtonSecondary
            onClick={() => {
              onCopy();
              onClose();
              toast({
                title: "Copiado",
                position: "top",
                status: "success",
                isClosable: false,
                duration: 2000,
              });
            }}
            type="button"
            icon={<Paperclip />}>
            Copiar
          </ButtonSecondary>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShareModal;
