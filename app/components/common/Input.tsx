import React, {
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEventHandler,
  useState,
} from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      <div className="relative w-full">
        <input
          className={`${className} rounded-md p-2 outline-none w-full`}
          name={name}
          value={value}
          type={type === "password" && showPassword ? "text" : type}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          style={{
            backgroundColor: "#F7F7F7",
            height: 64,
            paddingRight: type === "password" ? "48px" : "24px", // Add extra padding for password toggle
            paddingLeft: "24px",
          }}
        />
        {/* Add password visibility toggle button */}
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
