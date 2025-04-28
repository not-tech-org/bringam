import React from "react";
import Preloader from "./Preloader";

interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  style?: string;
  onClick?: any;
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
      } flex items-center justify-center text-sm gap-2 py-[.9em] px-[1.3em] my-[2em] ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}>
      {isLoading ? <Preloader height={25} color="#fff" /> : label || children}
    </button>
  );
};

export default Button;
