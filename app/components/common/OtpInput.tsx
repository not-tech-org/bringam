"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  helperText?: string;
  autoFocus?: boolean;
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
  error,
  label,
  helperText,
  autoFocus = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Initialize inputRefs with the correct length
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
    // Focus on the first input if autoFocus is true
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [length, autoFocus]);

  // Focus on the active input
  useEffect(() => {
    if (
      inputRefs.current[activeIndex] !== null &&
      inputRefs.current[activeIndex] !== undefined
    ) {
      inputRefs.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  // Split the value into individual digits
  const valueArray = value.split("").slice(0, length);

  // Handle input change
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;

    // Get only the last character if multiple characters are pasted
    const lastChar = newValue.slice(-1);

    // Allow only digits
    if (lastChar && !/^\d+$/.test(lastChar)) {
      return;
    }

    // Create a new array with the updated value
    const newValueArray = [...valueArray];
    newValueArray[index] = lastChar;

    // Update the value
    onChange(newValueArray.join(""));

    // Move to the next input if a value is entered
    if (lastChar && index < length - 1) {
      setActiveIndex(index + 1);
    }
  };

  // Handle key down events
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to the previous input on backspace
    if (e.key === "Backspace") {
      if (!valueArray[index] && index > 0) {
        setActiveIndex(index - 1);
      }
    }
    // Move to the next input on arrow right
    else if (e.key === "ArrowRight" && index < length - 1) {
      setActiveIndex(index + 1);
    }
    // Move to the previous input on arrow left
    else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Allow only digits
    const digits = pastedData.replace(/\D/g, "").slice(0, length);

    if (digits) {
      onChange(digits);

      // Focus on the input after the last pasted digit
      const newIndex = Math.min(digits.length, length - 1);
      setActiveIndex(newIndex);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-black3 text-sm md:text-base font-semibold mb-2">
          {label}
        </label>
      )}
      {helperText && (
        <p className="text-xs md:text-sm text-gray-500 mb-2">{helperText}</p>
      )}

      <div className="flex justify-between gap-1 sm:gap-2 md:gap-4">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={valueArray[index] || ""}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(index)}
            className={cn(
              "w-full aspect-square max-w-10 sm:max-w-12 md:max-w-14 text-center text-lg md:text-xl font-bold border rounded-lg outline-none",
              "focus:border-[#2B3B2B] focus:ring-1 focus:ring-[#2B3B2B]",
              error ? "border-red-500" : "border-gray-300",
              "bg-[#F7F7F7]"
            )}
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-xs md:text-sm mt-1">{error}</p>}
    </div>
  );
}
