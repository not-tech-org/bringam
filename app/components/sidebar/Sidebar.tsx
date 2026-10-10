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
  hover: { x: 3 },
};

const Sidebar = () => {
  const pathname = usePathname();
  const { isVendorView, isVendorCapable, userName, userInitials } = useUser();
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
    { path: "/vendor-store", label: "Stores", icon: "/icons/store.svg" },
    { path: "/products", label: "Products", icon: "/icons/box.svg" },
    { path: "/orders", label: "Orders", icon: "/icons/order.svg" },
    {
      path: "/transactions",
      label: "Transactions",
      icon: "/icons/cartIcon.svg",
    },
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
    const isStorePage = pathname.startsWith("/store/");
    const isActive =
      (isStorePage && item.path === "/all") ||
      (pathname.startsWith(item.path) && item.path !== "/");

    return (
      <Link
        href={item.path}
        key={item.path}
        aria-current={isActive ? "page" : undefined}
        className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-bgArmy"
      >
        <motion.div
          className={`group mb-1 flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 ${
            isActive
              ? "bg-white/10 text-white"
              : "text-lighterArmy hover:bg-white/5 hover:text-white"
          }`}
          variants={menuItemVariants}
          initial="initial"
          whileHover="hover"
          transition={{ type: "spring", duration: 0.2 }}
        >
          <Image
            src={item.icon}
            alt=""
            width={16}
            height={16}
            className={`brightness-0 invert transition-opacity duration-200 ${
              isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
            }`}
          />
          <span className={`font-medium ${isActive ? "font-bold" : ""}`}>
            {item.label}
          </span>
        </motion.div>
      </Link>
    );
  };

  const primaryItems = isVendorView ? vendorMenuItems : customerMenuItems;
  const personalItems = isVendorView
    ? vendorPersonalItems
    : customerPersonalItems;
  const primaryLabel = isVendorView ? "General" : "Categories";

  return (
    <>
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />

      <aside className="fixed left-0 top-0 z-20 hidden h-screen max-h-screen w-[280px] select-none flex-col overflow-hidden bg-bgArmy px-6 py-4 lg:flex">
        <div className="flex h-16 shrink-0 items-center gap-2">
          <Image
            src="/icons/brand-logo.svg"
            alt=""
            width={30}
            height={30}
            className="shrink-0"
          />
          <p className="text-lg font-bold text-white">BringAm</p>
        </div>

        <nav
          aria-label={isVendorView ? "Vendor navigation" : "Customer navigation"}
          className="custom-scrollbar min-h-0 flex-1 overscroll-contain pr-1"
        >
          <div className="pt-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-lightArmy">
              {primaryLabel}
            </p>
            <div className="text-sm">{primaryItems.map(renderMenuItem)}</div>
          </div>

          <div className="mt-6">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-lightArmy">
              Personal
            </p>
            <div className="text-sm">{personalItems.map(renderMenuItem)}</div>
            <div className="px-3">
              <SignoutButton />
            </div>
          </div>
        </nav>

        <div className="shrink-0 border-t border-white/10 bg-bgArmy pt-4">
          <motion.button
            type="button"
            onClick={openProfileModal}
            className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-[#456563] p-3 text-left text-[#CBD9D8] transition-colors duration-200 hover:bg-[#4a6b69] focus:outline-none focus:ring-2 focus:ring-white/60"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFD700] text-xs font-bold tracking-wide text-primary ring-2 ring-white/10"
            >
              {userInitials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{userName}</p>
              <p className="text-[10px]">
                {isVendorView ? "Account settings" : "Customer account"}
              </p>
            </div>
            {isVendorView && <MdArrowOutward className="shrink-0" />}
          </motion.button>

          {!isVendorView && !isVendorCapable && (
            <Link
              href="/vendor-signup"
              className="mt-3 block rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              <motion.div
                className="flex min-h-11 items-center justify-between rounded-lg border border-white/10 bg-[#456563] px-4 py-3 text-[#CBD9D8] transition-colors duration-200 hover:bg-[#4a6b69]"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <p className="text-sm">Become a vendor</p>
                <MdArrowOutward className="shrink-0" />
              </motion.div>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
