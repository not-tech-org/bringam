"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { IoNotificationsOutline } from "react-icons/io5";
import Image from "next/image";
import { RxExit } from "react-icons/rx";
import { useUser } from "@/app/contexts/UserContext";

interface VendorHeaderProps {
  title?: string;
}

export default function VendorHeader({ title }: VendorHeaderProps) {
  const pathname = usePathname();
  const route = pathname.split("/").join("")?.split("-").pop() || "";
  const formattedRoute = route.charAt(0).toUpperCase() + route.slice(1);

  const { isVendorView, isVendorCapable, switchToCustomer, switchToVendor } =
    useUser();

  // Use provided title or fall back to URL-based title
  const displayTitle = title || formattedRoute;

  return (
    <div className="flex items-center justify-between py-6 px-8 pl-16 border-b bg-white">
      <h1 className="text-2xl font-medium">{displayTitle}</h1>
      <div className="flex items-center gap-4">
        {isVendorCapable && (
          <button
            onClick={isVendorView ? switchToCustomer : switchToVendor}
            className="flex items-center justify-between bg-black text-white gap-3 p-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <RxExit />
            <p>{isVendorView ? "Switch to Customer" : "Switch to Vendor"}</p>
          </button>
        )}
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
