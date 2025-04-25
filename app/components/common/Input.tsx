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
  error?: string;
  prefix?: string;
  suffix?: string;
  helperText?: string;
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
  error,
  prefix,
  suffix,
  helperText,
}) => {
  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine padding based on prefix, suffix, and password type
  const getPadding = () => {
    const styles: React.CSSProperties = {
      paddingLeft: prefix ? "48px" : "24px",
    };

    // Determine right padding - use the larger value if both suffix and password
    if (type === "password" || suffix) {
      styles.paddingRight = "48px";
    } else {
      styles.paddingRight = "24px";
    }

    return styles;
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
      {helperText && <p className="text-sm text-gray-500 mb-2">{helperText}</p>}
      <div className="relative w-full">
        {prefix && (
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
            {prefix}
          </span>
        )}
        <input
          className={`${className} rounded-md p-2 outline-none w-full ${
            error ? "border-red-500 border" : ""
          }`}
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
            ...getPadding(),
          }}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            {suffix}
          </span>
        )}
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
