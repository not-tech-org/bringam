"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";

interface UploadProps {
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: string[];
  className?: string;
}

export default function Upload({
  onChange,
  maxFiles = 10,
  maxSize = 1024 * 1024, // 1MB
  accept = ["image/jpeg", "image/png", "image/jpg"],
  className = "",
}: UploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxFiles,
    maxSize,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors ${className}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <IoCloudUploadOutline className="w-8 h-8 text-gray-400" />
        <div className="text-sm text-gray-600">
          <span className="text-blue-600">Click to upload</span> or drag and
          drop
        </div>
        <div className="text-xs text-gray-500">
          Accepted file formats: .jpg, .jpeg, and .png
          <br />
          Add up to {maxFiles} files, {maxSize / (1024 * 1024)}mb size limit and{" "}
          {maxSize / 1024}kb max.
        </div>
      </div>
    </div>
  );
}
