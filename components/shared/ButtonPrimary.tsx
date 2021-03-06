import React from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonPrimaryProps {
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  children: string;
  icon?: React.ReactNode;
  ref?: React.RefObject<undefined>;
  onClick?(): void;
  className?: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  type = "submit",
  isLoading = false,
  icon,
  className = "",
  children,
  onClick = null,
  ref = null,
  ...rest
}) => (
  <button
    type={type}
    className={`black-btn ${isLoading && "justify-center"} ${className}`}
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

export default ButtonPrimary;
