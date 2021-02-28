import React from "react";
import { Select } from "@chakra-ui/react";

interface SelectInputProps {
  placeholder?: string;
  className?: string;
  onChange?(event): void;
}

const SelectInput: React.FC<SelectInputProps> = ({
  placeholder = "",
  className = "",
  onChange = null,
  children,
}) => (
  <Select
    mb={4}
    bg="white"
    borderColor="black"
    borderWidth={2}
    placeholder={placeholder}
    variant="filled"
    focusBorderColor="black"
    _hover={{ backgroundColor: "#F3F4F6" }}
    onChange={onChange}
    className={`${className} font-medium`}>
    {children}
  </Select>
);

export default SelectInput;
