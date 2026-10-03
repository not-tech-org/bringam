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
  title?: string;
}

const Wrapper: React.FC<WrapperProps> = ({ children, title }) => {
  // const router = useRouter()
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1 lg:ml-[280px]">
        <VendorHeader title={title} />
        <main className="px-4 pt-24 sm:px-8 lg:px-16 lg:pt-28">{children}</main>
      </div>
    </div>
  );
};

export default Wrapper;
