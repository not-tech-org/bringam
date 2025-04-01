"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdArrowOutward } from "react-icons/md";
import { usePathname } from "next/navigation";
import SignoutButton from "./SignoutButton";

const Sidebar = () => {
  const vendor = true;
  const pathname = usePathname();

  const customerMenuItems = [
    { path: "/all", label: "All", icon: "/icons/all.svg" },
    { path: "/gadgets", label: "Gadgets", icon: "/icons/headset.svg" },
    {
      path: "/health-beauty",
      label: "Health & beauty",
      icon: "/icons/heart.svg",
    },
    {
      path: "/phones-tablets",
      label: "Phones and tablets",
      icon: "/icons/phone.svg",
    },
    { path: "/fashion", label: "Fashion", icon: "/icons/fashion.svg" },
    { path: "/gaming", label: "Gaming", icon: "/icons/gaming.svg" },
    { path: "/groceries", label: "Groceries", icon: "/icons/coffee.svg" },
  ];

  const customerPersonalItems = [
    { path: "/my-orders", label: "My Orders", icon: "/icons/all.svg" },
    { path: "/vendors", label: "Vendors", icon: "/icons/headset.svg" },
    {
      path: "/notifications",
      label: "Notifications",
      icon: "/icons/heart.svg",
    },
    { path: "/settings", label: "Settings", icon: "/icons/electronics.svg" },
    { path: "/support", label: "Support", icon: "/icons/phone.svg" },
  ];

  const vendorMenuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "/icons/all.svg" },
    { path: "/products", label: "Products", icon: "/icons/headset.svg" },
    { path: "/transactions", label: "Transactions", icon: "/icons/heart.svg" },
    { path: "/orders", label: "Orders", icon: "/icons/electronics.svg" },
    { path: "/vendor-store", label: "Stores", icon: "/icons/phone.svg" },
  ];

  const vendorPersonalItems = [
    {
      path: "/notifications",
      label: "Notifications",
      icon: "/icons/heart.svg",
    },
    { path: "/settings", label: "Settings", icon: "/icons/electronics.svg" },
    { path: "/support", label: "Support", icon: "/icons/headset.svg" },
  ];

  const renderMenuItem = (item: {
    path: string;
    label: string;
    icon: string;
  }) => {
    const isActive = pathname === item.path;
    return (
      <Link href={item.path} key={item.path}>
        <div
          className={`flex items-center gap-2 my-6 group cursor-pointer ${
            isActive ? "text-white" : "text-lighterArmy hover:text-white"
          }`}
        >
          <Image
            src={item.icon}
            alt={`${item.label} Icon`}
            width={16}
            height={16}
            className={`${
              isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
            }`}
          />
          <p className={`font-medium ${isActive ? "font-bold" : ""}`}>
            {item.label}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-[280px] h-screen bg-bgArmy px-8 py-4 fixed top-0 left-0 z-20">
      <div className="flex items-center gap-2 h-20">
        <Image
          src="/icons/brand-logo.svg"
          alt="Brand Logo"
          width={30}
          height={30}
        />
        <p className="text-lg text-white font-bold">BringAm</p>
      </div>
      {!vendor ? (
        <div className="overflowForced h-full">
          <div className="mt-8">
            <p className="text-sm text-lightArmy font-medium mb-6">
              Categories
            </p>
            <div className="pl-4 text-sm">
              {customerMenuItems.map(renderMenuItem)}
            </div>
          </div>
          <div className="mt-12">
            <p className="text-sm text-lightArmy font-medium mb-6">Personal</p>
            <div className="pl-4 text-sm">
              {customerPersonalItems.map(renderMenuItem)}
            </div>
            <SignoutButton />
          </div>
          <div className="mt-16">
            <Link href="/vendor-auth">
              <div className="p-4 px-8 border rounded-lg flex items-center justify-between bg-[#456563] text-[#CBD9D8] cursor-pointer">
                <p className="text-sm">Become a Vendor</p>
                <MdArrowOutward />
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflowForced h-full">
          <div className="mt-8">
            <p className="text-sm text-lightArmy font-medium mb-6">General</p>
            <div className="pl-4 text-sm">
              {vendorMenuItems.map(renderMenuItem)}
            </div>
          </div>
          <div className="mt-12">
            <p className="text-sm text-lightArmy font-medium mb-6">Personal</p>
            <div className="pl-4 text-sm">
              {vendorPersonalItems.map(renderMenuItem)}
            </div>
            <SignoutButton />
          </div>
          <div className="mt-16">
            <Link href="/vendor-auth">
              <div className="p-4 px-6 border rounded-lg flex items-center justify-between bg-[#456563] text-[#CBD9D8] cursor-pointer">
                <Image
                  src="/icons/Status.png"
                  width={35}
                  height={35}
                  alt="icon"
                />
                <div>
                  <p className="text-sm text-white font-bold">Albert Gaits</p>
                  <p className="text-xs" style={{ fontSize: 10 }}>
                    Account settings
                  </p>
                </div>
                <MdArrowOutward />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
