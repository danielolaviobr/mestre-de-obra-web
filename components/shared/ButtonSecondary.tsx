import React from "react";

interface ButtonSecondaryProps {
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  children: string;
  icon?: React.ReactNode;
  ref?: React.RefObject<undefined>;
  onClick?(): void;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  type = "submit",
  isLoading = false,
  icon,
  children,
  onClick = null,
  ref = null,
  ...rest
}) => (
  <button
    type={type}
    className={`border-btn ${isLoading && "justify-center"}`}
    onClick={onClick}
    ref={ref}
    {...rest}>
    {isLoading ? (
      <object
        type="image/svg+xml"
        data="/assets/loading.svg"
        className="self-center w-7 h-7 justify-self-center">
        Carregando
      </object>
    ) : (
      <>
        {children}
        {icon}
      </>
    )}
  </button>
);

export default ButtonSecondary;
