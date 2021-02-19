import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useField } from "@unform/core";

interface TextInputProps {
  leftIcon?: React.ReactNode;
  showPasswordButton?: boolean;
  name: string;
  [key: string]: any;
}

const TextInput: React.FC<TextInputProps> = ({
  leftIcon,
  name,
  showPasswordButton = false,
  ...rest
}) => {
  const [iconColor, setIconColor] = useState("gray");
  const [show, setShow] = useState(false);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleFocus = useCallback(() => setIconColor("#000"), []);
  const handleBlur = useCallback(() => setIconColor("#gray"), []);
  const handleClick = useCallback(() => setShow((state) => !state), []);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [registerField, fieldName]);

  return (
    <InputGroup size="md" className="mb-4">
      <InputLeftElement color={error ? "crimson" : iconColor} py={6}>
        {leftIcon}
      </InputLeftElement>
      <Input
        {...rest}
        py={6}
        borderColor="black"
        isInvalid={!!error}
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        focusBorderColor="black"
        type={showPasswordButton && !show ? "password" : "text"}
        _hover={{ borderColor: "black" }}
      />
      {showPasswordButton && (
        <InputRightElement width="6rem" ml="2" pl="5" pr="2" py={6}>
          {/* <Button
            h="1.75rem"
            size="sm"
            onClick={handleClick}
            colorScheme="gray"
            fontSize="smaller">
            {show ? "Esconder" : "Mostrar"}
          </Button> */}
          <button
            type="button"
            className="ml-2 text-sm font-semibold "
            onClick={handleClick}>
            {show ? "Esconder" : "Mostrar"}
          </button>
        </InputRightElement>
      )}
    </InputGroup>
  );
};

export default TextInput;
