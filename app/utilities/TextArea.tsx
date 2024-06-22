import React, { ChangeEvent } from "react";

interface TextAreaProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  label,
  className,
  placeholder,
  required,
}) => {
  return (
    <div className="flex flex-col items-start w-full gap-[.5rem]">
      {label && (
        <label
          htmlFor={value}
          className="font-medium text-base leading-[16px] text-grayscalBody2">
          <span className="text-primary">* </span>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? ""}
        className={`placeholder:font-montserrat placeholder:font-normal placeholder:text-[16px] placeholder:leading-[20.28px] outline-none w-full bg-inputBg flex-1 py-[11px] px-[12px] rounded-[10px] ${className}
        `}
        required={required}
      />
    </div>
  );
};

export default TextArea;
