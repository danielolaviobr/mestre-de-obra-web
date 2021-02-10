import React from "react";
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
  const { signOut } = useAuth();
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
          <Link href="/upload">
            <MenuItem>Fazer upload</MenuItem>
          </Link>
          <Link href="/create-project">
            <MenuItem>Criar projeto</MenuItem>
          </Link>
          <Link href="/add-user-to-project">
            <MenuItem>Adicionar membros</MenuItem>
          </Link>
          <MenuDivider />
          <MenuItem onClick={signOut}>Sair</MenuItem>
        </MenuList>
      </MenuUI>
    </Box>
  );
};

export default Menu;
