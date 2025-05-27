"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { IoNotificationsOutline } from "react-icons/io5";
import Image from "next/image";
import { RxExit } from "react-icons/rx";

export default function VendorHeader() {
  const pathname = usePathname();
  const route = pathname.split("/").join("")?.split("-").pop() || "";
  const formattedRoute = route.charAt(0).toUpperCase() + route.slice(1);

  const handleSwitchToCustomer = () => {
    // Switch between to customer and vendor
  };

  return (
    <div className="flex items-center justify-between py-6 px-8 pl-16 border-b bg-white">
      <h1 className="text-2xl font-medium">{formattedRoute}</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={handleSwitchToCustomer}
          className="flex items-center justify-between bg-black text-white gap-3 p-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <RxExit />
          <p>Switch to customer</p>
        </button>
        <button className="relative">
          <IoNotificationsOutline className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        </button>
        <div className="relative">
          <Image
            src="/images/avatar1.svg"
            alt="User avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
      </div>
    </div>
  );
}
