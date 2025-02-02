import React from "react";
import { RiSearch2Line } from "react-icons/ri";

interface InputFilterProps {
  label?: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  height?: string;
}

const InputFilter: React.FC<InputFilterProps> = ({
  label,
  name,
  value,
  type = "text",
  placeholder,
  onChange,
  required,
  onKeyUp,
  onKeyDown,
  height = "38px",
}) => {
  return (
    <div
      className="flex items-center gap-1 p-2.5 text-sm font-normal leading-6 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm"
      style={{ height }}
    >
      <RiSearch2Line size={14} color="#404253" />
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        className="w-full border-none h-8 focus:outline-none"
      />
    </div>
  );
};

export default InputFilter;
