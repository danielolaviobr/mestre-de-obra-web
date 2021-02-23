import React from "react";

interface LoadingSpinnerProps {
  className?: string;
  color?: "black" | "white";
  [key: string]: any;
}

const LoadingSpinner = ({
  className = "",
  color = "white",
  ...rest
}: LoadingSpinnerProps) => (
  <object
    type="image/svg+xml"
    data="/assets/loading.svg"
    className={className}
    {...rest}>
    Carregando
  </object>
);

export default LoadingSpinner;
