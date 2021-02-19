import React from "react";

interface ButtonSecondaryProps {
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  children: string;
  icon?: React.ReactNode;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  type = "submit",
  isLoading = false,
  icon,
  children,
  ...rest
}) => (
  <button
    type={type}
    className={`border-btn ${isLoading && "justify-center"}`}
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
