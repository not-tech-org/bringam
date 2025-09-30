"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { IoNotificationsOutline } from "react-icons/io5";
import Image from "next/image";
import { RxExit } from "react-icons/rx";
import { useUser } from "@/app/contexts/UserContext";
import { useCart } from "@/app/contexts/CartContext";
import Link from "next/link";

interface VendorHeaderProps {
  title?: string;
}

export default function VendorHeader({ title }: VendorHeaderProps) {
  const pathname = usePathname();
  const route = pathname.split("/").join("")?.split("-").pop() || "";
  const formattedRoute = route.charAt(0).toUpperCase() + route.slice(1);

  const { isVendorView, isVendorCapable, switchToCustomer, switchToVendor } =
    useUser();

  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  // Use provided title or fall back to URL-based title
  const displayTitle = title || formattedRoute;

  return (
    <div className="flex items-center justify-between py-6 px-8 pl-16 border-b bg-white fixed top-0 left-[280px] right-0 z-50">
      <h1 className="text-2xl font-medium">{displayTitle}</h1>
      <div className="flex items-center gap-8">
        {/* Cart Icon - Only show in customer view */}
        {!isVendorView && (
          <Link href="/cart" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <div className="relative">
              <Image
                src="/icons/cartIcon.svg"
                alt="Cart icon"
                width={24}
                height={24}
              />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3c4948] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">Cart</span>
          </Link>
        )}

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
