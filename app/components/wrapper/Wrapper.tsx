"use client";

import React, { ReactNode } from "react";
// import Sidebar from "../Sidebar";
// import Header from "../Header";
import Header from "@/app/components/header/Header";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { useRouter } from "next/router";
import VendorHeader from "../vendor-header/VendorHeader";

interface WrapperProps {
  children: ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  // const router = useRouter()
  // console.log("Wrapper: ", router)
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <VendorHeader />
        <main className="pt-32 px-16">{children}</main>
      </div>
    </div>
  );
};

export default Wrapper;
