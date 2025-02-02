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
  className?: string;
  type: "button" | "submit" | "reset";
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
  className,
  type,
}) => {
  return (
    <button
      className={`${style} ${primary && "btn-primary"}  ${
        secondary && "btn-secondary"
      } flex items-center justify-center w-full gap-2 ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}>
      {isLoading ? <Preloader height={30} color="#fff" /> : label || children}
    </button>
  );
};

export default Button;
