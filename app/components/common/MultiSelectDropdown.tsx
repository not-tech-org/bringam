import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  onSelect: (selectedOptions: Option[]) => void;
  className?: string;
  placeholder?: string;
  existingSeleted: Option[];
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  onSelect,
  className,
  placeholder,
  existingSeleted,
}) => {
  const [selectedOptions, setSelectedOptions] =
    useState<Option[]>(existingSeleted);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleOptionChange = (option: Option) => {
    let updatedOptions: Option[];
    if (selectedOptions.some((selected) => selected.value === option.value)) {
      updatedOptions = selectedOptions.filter(
        (selected) => selected.value !== option.value
      );
    } else {
      updatedOptions = [...selectedOptions, option];
    }
    setSelectedOptions(updatedOptions);
    onSelect(updatedOptions);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative inline-block w-full">
      <div
        className={`p-2 border border-gray-300 rounded cursor-pointer bg-white flex justify-between items-center py-[11px] px-[12px] ${className}`}
        onClick={toggleDropdown}>
        <span className="truncate text-gray-400">{placeholder}</span>
        <span>{isDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
      </div>
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-primary"
                value={option.value}
                checked={selectedOptions.some(
                  (selected) => selected.value === option.value
                )}
                onChange={() => handleOptionChange(option)}
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
