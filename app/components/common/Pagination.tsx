"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 my-16">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IoChevronBack className="w-5 h-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
            currentPage === page
              ? "bg-[#2B3B2B] text-white"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IoChevronForward className="w-5 h-5" />
      </button>
    </div>
  );
}
