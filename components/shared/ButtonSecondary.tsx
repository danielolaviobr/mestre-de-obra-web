import React, { useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonSecondaryProps {
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  children: string;
  icon?: React.ReactNode;
  onClick?(): void;
  className?: string;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  type = "submit",
  isLoading = false,
  icon,
  children,
  className = "",
  onClick = null,
  ...rest
}) => {
  const ref = useRef();
  return (
    <button
      type={type}
      className={`border-btn ${isLoading && "justify-center"} ${className}`}
      onClick={onClick}
      ref={ref}
      {...rest}>
      {isLoading ? (
        <LoadingSpinner className="self-center w-7 h-7 justify-self-center" />
      ) : (
        <>
          {children}
          {icon}
        </>
      )}
    </button>
  );
};

export default ButtonSecondary;
