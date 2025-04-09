import React, { ChangeEvent } from "react";

interface SelectProps {
  label?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; name: string }[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeHolder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  className,
  disabled,
  required,
  placeHolder,
}) => {
  return (
    <div className="flex flex-col items-start w-full gap-[.5rem]">
      {label && (
        <label
          htmlFor={value}
          className="font-normal text-base leading-[16px] text-grayscalBody2">
          <span className="text-primary">* </span>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`placeholder:font-montserrat placeholder:font-normal placeholder:text-base placeholder:leading-[20.28px] outline-none w-full py-[11px] px-[12px] rounded-none cursor-pointer text-sm ${className}`}>
        <option value="" disabled className="text-borderColor">
          {placeHolder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value} className="text-sm">
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
