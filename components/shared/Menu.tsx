import React from "react";
import {
  Menu as MenuUI,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  Button,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";

import { FiChevronDown } from "react-icons/fi";
import { useAuth } from "hooks/auth";

const Menu: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <Box m={4}>
      <MenuUI>
        <MenuButton as={Button} rightIcon={<FiChevronDown />}>
          Menu
        </MenuButton>
        <MenuList>
          <Link href="/dashboard">
            <MenuItem>Início</MenuItem>
          </Link>
          <Link href="/upload">
            <MenuItem>Fazer upload</MenuItem>
          </Link>
          <MenuDivider />
          <MenuItem onClick={signOut}>Sair</MenuItem>
        </MenuList>
      </MenuUI>
    </Box>
  );
};

export default Menu;
