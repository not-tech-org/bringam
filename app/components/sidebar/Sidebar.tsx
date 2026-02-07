"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdArrowOutward } from "react-icons/md";
import { useUser } from "@/app/contexts/UserContext";
import UserProfileModal from "../common/UserProfileModal";
import SignoutButton from "./SignoutButton";
import { motion } from "framer-motion";

// Animation variants for sidebar menu items
const menuItemVariants = {
  initial: { x: 0 },
  hover: { x: 4 }
};

const Sidebar = () => {
  const pathname = usePathname();
  const { isVendorView, isVendorCapable, userName } = useUser();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

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
    { path: "/wishlist", label: "Wishlist", icon: "/icons/heart.svg" },
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
    // Special case: store pages should highlight "All" menu item
    const isStorePage = pathname.startsWith('/store/');
    const isActive = (isStorePage && item.path === '/all') || 
                     (pathname.startsWith(item.path) && item.path !== "/");
    
    return (
      <Link href={item.path} key={item.path}>
        <motion.div
          className={`flex items-center gap-2 my-6 group cursor-pointer transition-colors duration-200 ${
            isActive ? "text-white" : "text-lighterArmy hover:text-white"
          }`}
          variants={menuItemVariants}
          initial="initial"
          whileHover="hover"
          transition={{ type: "spring", duration: 0.2 }}
        >
          <Image
            src={item.icon}
            alt={`${item.label} Icon`}
            width={16}
            height={16}
            className={`transition-opacity duration-200 ${
              isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
            }`}
          />
          <p
            className={`font-medium transition-all duration-200 ${
              isActive ? "font-bold" : ""
            }`}
          >
            {item.label}
          </p>
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />

      <div className="w-[280px] h-screen bg-bgArmy px-8 py-4 fixed top-0 left-0 z-20 select-none">
        {/* Header */}
        <div className="flex items-center gap-2 h-20 flex-shrink-0">
          <Image
            src="/icons/brand-logo.svg"
            alt="Brand Logo"
            width={30}
            height={30}
            className="flex-shrink-0"
          />
          <p className="text-lg text-white font-bold">BringAm</p>
        </div>

        {/* Scrollable Content */}
        {!isVendorView ? (
          <div className="custom-scrollbar h-[calc(100vh-5rem)] flex flex-col">
            <div className="mt-8 flex-shrink-0">
              <p className="text-sm text-lightArmy font-medium mb-6">
                Categories
              </p>
              <div className="pl-4 text-sm">
                {customerMenuItems.map(renderMenuItem)}
              </div>
            </div>

            <div className="mt-12 flex-shrink-0">
              <p className="text-sm text-lightArmy font-medium mb-6">
                Personal
              </p>
              <div className="pl-4 text-sm">
                {customerPersonalItems.map(renderMenuItem)}
              </div>
              <SignoutButton />
            </div>

            {/* Spacer to push bottom content down */}
            <div className="flex-grow"></div>

            {/* Bottom content - User info and Become Vendor */}
            <div className="flex-shrink-0 pb-12">
              {/* User info section for customers */}
              <div className="mb-4">
                <motion.div
                  onClick={openProfileModal}
                  className="p-4 px-6 border rounded-lg flex items-center gap-3 bg-[#456563] text-[#CBD9D8] cursor-pointer transition-all duration-200 hover:bg-[#4a6b69]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Image
                    src="/icons/Status.png"
                    width={35}
                    height={35}
                    alt="profile"
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-bold truncate">
                      {userName}
                    </p>
                    <p className="text-xs" style={{ fontSize: 10 }}>
                      Customer Account
                    </p>
                  </div>
                </motion.div>
              </div>

              {!isVendorCapable && (
                <div>
                  <Link href="/vendor-signup">
                    <motion.div 
                      className="p-4 px-8 border rounded-lg flex items-center justify-between bg-[#456563] text-[#CBD9D8] cursor-pointer transition-all duration-200 hover:bg-[#4a6b69]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p className="text-sm">Become a Vendor</p>
                      <MdArrowOutward className="flex-shrink-0" />
                    </motion.div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="custom-scrollbar h-[calc(100vh-5rem)] flex flex-col">
            <div className="mt-8 flex-shrink-0">
              <p className="text-sm text-lightArmy font-medium mb-6">General</p>
              <div className="pl-4 text-sm">
                {vendorMenuItems.map(renderMenuItem)}
              </div>
            </div>

            <div className="mt-12 flex-shrink-0">
              <p className="text-sm text-lightArmy font-medium mb-6">
                Personal
              </p>
              <div className="pl-4 text-sm">
                {vendorPersonalItems.map(renderMenuItem)}
              </div>
              <SignoutButton />
            </div>

            {/* Spacer to push bottom content down */}
            <div className="flex-grow"></div>

            {/* Bottom content - Vendor account settings */}
            <div className="flex-shrink-0 pb-12">
              <motion.div
                onClick={openProfileModal}
                className="p-4 px-6 border rounded-lg flex items-center justify-between bg-[#456563] text-[#CBD9D8] cursor-pointer transition-all duration-200 hover:bg-[#4a6b69]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  src="/icons/Status.png"
                  width={35}
                  height={35}
                  alt="icon"
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0 mx-3">
                  <p className="text-xs text-white font-bold truncate">
                    {userName}
                  </p>
                  <p className="text-xs" style={{ fontSize: 10 }}>
                    Account settings
                  </p>
                </div>
                <MdArrowOutward className="flex-shrink-0" />
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
