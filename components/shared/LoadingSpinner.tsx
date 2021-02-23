import React from "react";

interface LoadingSpinnerProps {
  className?: string;
  [key: string]: any;
}

const LoadingSpinner = ({ className = "", ...rest }: LoadingSpinnerProps) => (
  <object
    type="image/svg+xml"
    data="/assets/loading.svg"
    className={className}
    {...rest}>
    Carregando
  </object>
);

export default LoadingSpinner;
