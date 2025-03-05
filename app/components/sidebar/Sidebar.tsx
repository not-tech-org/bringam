"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { BiPowerOff } from "react-icons/bi";
import { MdArrowOutward } from "react-icons/md";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import { showToast } from "../utils/helperFunctions";
import { logoutApi } from "@/app/services/AuthService";

const Sidebar = () => {
  const vendor = true;
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    console.log("Logout clicked");
    setIsLoading(true);

    try {
      const res = await logoutApi();
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);

      if (err.response) {
        showToast(err.response.data.message || "An error occurred", "error");
      } else {
        showToast("Network error or timeout", "error");
      }
      console.log(err);
    }
  };

  return (
    <div className="w-[280px] h-full bg-bgArmy px-8 py-4">
      <div className="flex items-center gap-2 z-10 h-20">
        <Image
          src="/icons/brand-logo.svg"
          alt="Brand Logo"
          width={30}
          height={30}
        />
        <p className="text-lg font-bold">BringAm</p>
      </div>
      {!vendor ? (
        <div className="overflowForced h-full">
          <div className="mt-8">
            <p className="text-sm text-lightArmy font-medium mb-6">
              {"Categories"}
            </p>
            <div className="pl-4 text-sm">
              <div className="flex items-center gap-2 my-6 hover:text-white hover:cursor-pointer">
                <Image
                  src="/icons/all.svg"
                  alt="All Icon"
                  width={20}
                  height={20}
                />
                <p className="text-white font-bold">All</p>
              </div>
              <div className="flex items-center gap-2 my-6 hover:text-white hover:cursor-pointer">
                <Image
                  src="/icons/headset.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Gadgets</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/heart.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Health & beauty</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/electronics.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Electronics</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/phone.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">
                  Phones and tablets
                </p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/fashion.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Fashion</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/gaming.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Gaming</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/coffee.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Groceries</p>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <p className="text-sm text-lightArmy font-medium mb-6">Personal</p>
            <div className="pl-4 text-sm">
              <div className="flex items-center gap-2 my-6 hover:text-white hover:cursor-pointer">
                <Image
                  src="/icons/all.svg"
                  alt="All Icon"
                  width={20}
                  height={20}
                />
                <p className="text-white font-bold">My Orders</p>
              </div>
              <div className="flex items-center gap-2 my-6 hover:text-white hover:cursor-pointer">
                <Image
                  src="/icons/headset.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Vendors</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/heart.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Notifications</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/electronics.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Settings</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/phone.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Support</p>
              </div>
            </div>
            {isLoading ? (
              <div className="text-center flex items-center gap-2 my-5">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="origin-left duration-200 text-sm md:text-base leading-[24px] font-medium">
                  Loading...
                </span>
              </div>
            ) : (
              <div
                className="text-center flex items-center gap-2 my-5 cursor-pointer"
                onClick={logout}>
                <BiPowerOff size={22} />
                <p className="text-lighterArmy font-medium">Logout</p>
              </div>
            )}
          </div>
          <div className="mt-16">
            <Link href="/vendorAuth">
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
            <p className="text-sm text-lightArmy font-medium mb-6">
              {"General"}
            </p>
            <div className="pl-4 text-sm">
              <div className="flex items-center gap-2 my-6 hover:text-white hover:cursor-pointer">
                <Image
                  src="/icons/all.svg"
                  alt="All Icon"
                  width={20}
                  height={20}
                />
                <p className="text-white font-bold">Dashboard</p>
              </div>
              <div className="flex items-center gap-2 my-6 hover:text-white hover:cursor-pointer">
                <Image
                  src="/icons/headset.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Products</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/heart.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Transactions</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/electronics.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Orders</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/phone.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Stores</p>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <p className="text-sm text-lightArmy font-medium mb-6">Personal</p>
            <div className="pl-4 text-sm">
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/heart.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Notifications</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/electronics.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Settings</p>
              </div>
              <div className="flex items-center gap-2 my-6">
                <Image
                  src="/icons/headset.svg"
                  alt="All Icon"
                  width={16}
                  height={16}
                />
                <p className="text-lighterArmy font-medium">Support</p>
              </div>
            </div>
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
