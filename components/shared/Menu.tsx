import React, { useEffect, useState } from "react";
import {
  Menu as MenuUI,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";

import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "hooks/auth";

interface MenuProps {
  className?: string;
}

const Menu: React.FC<MenuProps> = ({ className = "" }) => {
  const { signOut, user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (user) {
      setIsSubscribed(user.isSubscribed);
      setIsAnonymous(user.isAnonymous);
    }
  }, [user]);

  return (
    <Box className={`absolute left-4 top-4 ${className}`}>
      <MenuUI>
        <MenuButton
          colorScheme="blue"
          as={Button}
          rightIcon={<FiChevronDown />}>
          Menu
        </MenuButton>
        <MenuList>
          <Link href="/dashboard">
            <MenuItem>Início</MenuItem>
          </Link>
          {isSubscribed && (
            <>
              <Link href="/upload">
                <MenuItem>Fazer upload</MenuItem>
              </Link>
              <Link href="/create-project">
                <MenuItem>Criar projeto</MenuItem>
              </Link>
              <Link href="/add-user-to-project">
                <MenuItem>Adicionar membros</MenuItem>
              </Link>
            </>
          )}
          {!isAnonymous && (
            <Link href="/subscription">
              <MenuItem>Assinatura</MenuItem>
            </Link>
          )}
          <MenuDivider />
          <MenuItem onClick={signOut}>Sair</MenuItem>
        </MenuList>
      </MenuUI>
    </Box>
  );
};

export default Menu;
