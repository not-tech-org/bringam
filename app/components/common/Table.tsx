"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

export interface Column<T> {
  header: string;
  key: keyof T;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function Table<T>({
  columns,
  data,
  className,
  onRowClick,
  isLoading,
  emptyState,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center p-4">
        {emptyState || "No data available"}
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border shadow-sm rounded-lg border-[#e5e7eba7]">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-6 py-4 text-left text-sm font-medium text-gray-500",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              className={cn(
                "border-b border-[#e5e7eb7a]",
                onRowClick && "cursor-pointer hover:bg-gray-50"
              )}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={cn("px-6 py-4 text-sm", column.className)}
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
