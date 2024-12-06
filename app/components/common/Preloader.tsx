import React from "react";
import { Oval } from "react-loader-spinner";

interface PreloaderProps {
  height?: number;
  color?: string;
}

const Preloader: React.FC<PreloaderProps> = ({ height, color }) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Oval
        ariaLabel="loading-indicator"
        height={height || 45}
        secondaryColor="#adb5bd"
        color={color || "#52bf"}
      />
    </div>
  );
};

export default Preloader;
