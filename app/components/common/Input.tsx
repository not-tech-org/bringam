import React, { ChangeEvent, ChangeEventHandler, KeyboardEventHandler } from "react";

type InputProps = {
  label?: string;
  name: string;
  value?: string;
  type: string;
  id?: string;
  placeholder?: string;
  className?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

const Input: React.FC<InputProps> = ({
  label,
  id,
  name,
  value,
  type,
  placeholder,
  onChange,
  required,
  onKeyUp,
  onKeyDown,
  className,
}) => {
  return (
    <div className="w-100 flex flex-col">
      {label && (
        <label
          className="text-black3 text-base font-semibold mb-2"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        className={`${className} rounded-md p-2 px-6`}
        name={name}
        value={value}
        type={type}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        style={{ backgroundColor: "#F7F7F7", height: 64 }}
      />
    </div>
  );
};

export default Input;
