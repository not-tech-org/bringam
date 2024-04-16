import React, { ChangeEvent } from "react";

interface IInput {
  label?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type: string;
  id?: string;
  required?: boolean;
  onClick?: () => void;
  Icon?: string | any;
  disable?: boolean;
  important?: boolean;
}

const Input: React.FC<IInput> = ({
  label,
  value,
  onChange,
  placeholder,
  className,
  type,
  onClick,
  Icon,
  disable,
  required,
  id,
  important,
}) => {
  return (
    <div className="flex flex-col items-start w-full gap-[.5rem]">
      {label && (
        <label
          htmlFor={value}
          className="font-normal text-base leading-[16px] text-grayscalBody2">
          {!important && <span className="text-primary">* </span>}
          {label}
        </label>
      )}
      {Icon ? (
        <div
          className={`flex justify-between items-center w-full gap-2 px-[16px] py-[8px] ${className}`}>
          <Icon
            className="cursor-pointer text-label_color ml-[.5rem] text-lg w-[21px] h-[21px]"
            onClick={onClick}
          />
          <input
            id={id}
            type={type}
            value={value}
            disabled={disable}
            onChange={onChange}
            className="placeholder:font-montserrat placeholder:font-normal placeholder:text-base placeholder:leading-[20.28px] outline-none w-full bg-transparent text-black leading-[18.24px] font-normal"
            placeholder={placeholder}
            required={required}
          />
        </div>
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          disabled={disable}
          onChange={onChange}
          placeholder={placeholder}
          className={`placeholder:font-montserrat placeholder:font-normal placeholder:text-base placeholder:leading-[20.28px] outline-none w-full  flex-1 ${className}`}
          required={required}
        />
      )}
    </div>
  );
};

export default Input;
