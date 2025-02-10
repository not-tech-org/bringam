"use client"

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
    <div className="flex mx-auto w-full h-full">
      <div className="">
        <Sidebar />
      </div>
      <main className="w-full h-full pb-16 text-bgArmy overflowForced">
        <div className="">
          {/* <Header /> */}
          <VendorHeader />
        </div>
        <div className="m-28 mt-48">{children}</div>
      </main>
    </div>
  );
};

export default Wrapper;
