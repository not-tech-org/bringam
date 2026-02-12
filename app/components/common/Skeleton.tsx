import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

/**
 * Base Skeleton component for loading states
 * Follows design guidelines: uses #F7F7F7 background, rounded corners
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  rounded = "md",
}) => {
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`bg-[#F7F7F7] animate-pulse ${roundedClasses[rounded]} ${className}`}
      style={style}
    />
  );
};

/**
 * Skeleton card for store/product cards
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <Skeleton width={48} height={48} rounded="lg" />
        <div className="flex-1 space-y-2">
          <Skeleton height={20} width="60%" />
          <Skeleton height={16} width="80%" />
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <Skeleton height={14} width="40%" />
        <div className="flex items-center gap-2">
          <Skeleton width={24} height={24} rounded="full" />
          <Skeleton width={24} height={24} rounded="full" />
          <Skeleton width={24} height={24} rounded="full" />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for overview/metric cards
 */
export const SkeletonOverviewCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-4">
        <Skeleton width={40} height={40} rounded="lg" />
        <Skeleton height={16} width="60%" />
      </div>
      <div className="mt-4">
        <Skeleton height={32} width="50%" className="mb-2" />
        <Skeleton height={14} width="40%" />
      </div>
    </div>
  );
};

/**
 * Skeleton for table rows
 */
export const SkeletonTableRow: React.FC<{ columns?: number }> = ({
  columns = 4,
}) => {
  return (
    <tr className="border-b border-[#e5e7eb7a]">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton height={20} width={index === 0 ? "80%" : "60%"} />
        </td>
      ))}
    </tr>
  );
};

/**
 * Skeleton for table with header
 */
export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-6 border-b">
        <Skeleton height={24} width="30%" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#e5e7eba7]">
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-4 text-left">
                <Skeleton height={16} width="50%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonTableRow key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Skeleton;
