import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
import { AlignLeft, RefreshCw, X } from "react-feather";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div className="fixed top-0 z-10 flex items-center justify-center w-screen pb-4 bg-blue-500 shadow-sm h-11 standalone:h-20 pt-safe-top">
        <Heading color="white" className="my-8">
          Mestre de Obra
        </Heading>
        <RefreshCw
          color="white"
          size={25}
          className="absolute right-0 mx-6"
          onClick={() => {
            alert("hey");
          }}
        />
        <AlignLeft
          color="white"
          size={25}
          className="absolute left-0 mx-6"
          onClick={() => {
            if (isOpen) {
              onClose();
            } else {
              onOpen();
            }
          }}
        />
      </div>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="sm">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader>Drawer contents</DrawerHeader>
            <DrawerBody>
              <X color="black" size={30} onClick={onClose} />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default Header;
