import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface IAppLayout {
  children: ReactNode;
}

const AppLayout: React.FC<IAppLayout> = ({ children }) => {
  return (
    <div className="flex max-w-[1380px] mx-auto font-Poppins">
      <Sidebar />
      <div className="flex-1 bg-white overflow-y-auto px-[1rem] lg:px-[2rem] text-black1">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
