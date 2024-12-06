import React from "react";
import Preloader from "./Preloader";

interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  style?: string;
  onClick?: () => void;
  primary?: boolean;
  secondary?: boolean;
  label?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  style,
  onClick,
  primary,
  secondary,
  disabled,
  isLoading,
  label,
}) => {
  return (
    <button
      className={`${style} ${primary && "btn-primary"}  ${
        secondary && "btn-secondary"
      } flex items-center justify-center gap-2`}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? <Preloader height={30} color="#fff" /> : label || children}
    </button>
  );
};

export default Button;
