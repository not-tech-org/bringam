"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export default function TextArea({
  label,
  helperText,
  error,
  className,
  ...props
}: TextAreaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
      <textarea
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors min-h-[120px]",
          "focus:border-[#2B3B2B] focus:ring-1 focus:ring-[#2B3B2B]",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
