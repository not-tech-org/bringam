import React from "react";
import Image from "next/image";

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  avatars?: string[];
}

/**
 * Standard Overview Card component for displaying metrics/statistics
 * Follows design guidelines: white background, rounded-lg, shadow-sm, consistent spacing
 */
const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  avatars,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center bg-[#F8F9FB] rounded-lg">
          <Image src={icon} alt={title} width={24} height={24} />
        </div>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {avatars && avatars.length > 0 && (
          <div className="flex -space-x-2">
            {avatars.map((avatar, index) => (
              <Image
                key={index}
                src={avatar}
                alt="Member"
                width={24}
                height={24}
                className="rounded-full border-2 border-white"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;
