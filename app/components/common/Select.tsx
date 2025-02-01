import React, { ChangeEvent } from "react";
// import { ChevronDown } from "lucide-react";
import { FaChevronRight } from "react-icons/fa";

type SelectProps = {
  label?: string;
  name: string;
  value?: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  id?: string;
  className?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  showIcon?: boolean; // Optional left arrow icon
};

const Select: React.FC<SelectProps> = ({
  label,
  id,
  name,
  value,
  options,
  onChange,
  required,
  className,
  placeholder,
  showIcon = true,
}) => {
  return (
    <div className="w-[286px] flex flex-col relative">
      {label && (
        <label
          className="text-black3 text-base font-semibold mb-2"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`${className} w-full h-[53px] px-4 pr-10 bg-[#F7F7F7] rounded-md border-2 appearance-none`}
          name={name}
          value={value}
          id={id}
          onChange={onChange}
          required={required}
        >
          <option value="" className="text-[#747474]">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {showIcon && (
          <FaChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        )}
      </div>
    </div>
  );
};

export default Select;
