import React from "react";

interface ButtonPrimaryProps {
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  children: string;
  icon?: React.ReactNode;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  type = "submit",
  isLoading = false,
  icon,
  children,
}) => {
  return (
    <button
      type={type}
      className={`black-btn ${isLoading && "justify-center"}`}>
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
};

export default ButtonPrimary;
