import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
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
  const [iconColor, setIconColor] = useState("");
  const [show, setShow] = useState(false);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleFocus = useCallback(() => setIconColor("#3684cc"), []);
  const handleBlur = useCallback(() => setIconColor(""), []);
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
      <InputLeftElement color={error ? "crimson" : iconColor}>
        {leftIcon}
      </InputLeftElement>
      <Input
        {...rest}
        isInvalid={!!error}
        ref={inputRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type={showPasswordButton && !show ? "password" : "text"}
      />
      {showPasswordButton && (
        <InputRightElement width="6rem" ml="2" pl="5" pr="2">
          <Button
            h="1.75rem"
            size="sm"
            onClick={handleClick}
            colorScheme="gray"
            fontSize="smaller">
            {show ? "Esconder" : "Mostrar"}
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  );
};

export default TextInput;
