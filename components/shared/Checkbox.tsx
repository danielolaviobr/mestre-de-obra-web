import { Checkbox as CheckboxUI, Tooltip } from "@chakra-ui/react";
import { useField } from "@unform/core";
import React, { useEffect, useRef } from "react";

interface CheckboxProps {
  name: string;
  [key: string]: any;
}

const Checkbox: React.FC<CheckboxProps> = ({ name, children, ...rest }) => {
  const { fieldName, defaultValue, error, registerField } = useField(name);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: checkboxRef.current,
      path: "checked",
    });
  }, [registerField, fieldName]);

  return (
    <Tooltip hasArrow label={error} bg="black" color="white" placement="left">
      <CheckboxUI
        style={{
          WebkitAppearance: "none",
          MozAppearance: "none",
          appearance: "none",
        }}
        colorScheme="black"
        name={name}
        ref={checkboxRef}
        isInvalid={!!error}
        {...rest}>
        {children}
      </CheckboxUI>
    </Tooltip>
  );
};

export default Checkbox;
