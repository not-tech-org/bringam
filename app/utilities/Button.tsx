import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type: "button" | "submit" | "reset";
  className?: string;
  children: any;
  disabled?: boolean;
  Icon?: any;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  onClick,
  className,
  disabled,
  Icon,
}) => {
  return (
    <>
      {Icon ? (
        <div
          className={`px-4 py-2 rounded-[4px] ${
            disabled
              ? " opacity-[.7] text-Acc1 cursor-not-allowed"
              : "cursor-pointer"
          } font-montserrat flex items-center gap-1 ${className}`}>
          <span className="text-white text-lg">
            <Icon className="!text-white" />
          </span>
          <button type={type} onClick={onClick} disabled={disabled}>
            {children}
          </button>
        </div>
      ) : (
        <button
          type={type}
          className={`px-4 py-2 rounded-[4px] ${
            disabled
              ? "opacity-[.7] cursor-not-allowed "
              : " cursor-pointer"
          } font-montserrat ${className}`}
          onClick={onClick}
          disabled={disabled}>
          {children}
        </button>
      )}
    </>
  );
};

export default Button;
