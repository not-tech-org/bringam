"use client";

import React from "react";
import Image from "next/image";
import Input from "../common/Input";
import InputFilter from "../common/InputFilter";
import { useCart } from "../../contexts/CartContext";
import Link from "next/link";

const Header = () => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <div className="w-full flex justify-between items-center p-8 px-16 bg-offWhite border-b-2 border-[#EEEEEE] fixed z-20">
      <div className="w-3/4">
        <InputFilter
          name="search"
          placeholder="Search"
          value={""}
          onChange={() => console.log("Search")}
        />
      </div>

      {/* Primary actions */}
      <div className=" text-bgArmy flex items-center w-full ml-16">
        <div className="w-full flex items-center gap-2">
          <Image
            src="/icons/orderIcon.svg"
            alt="My orders icon"
            width={16}
            height={16}
          />
          <p className="text-sm font-medium">My orders</p>
        </div>
        <div className="w-full flex items-center gap-2">
          <Link href="/cart" className="flex items-center gap-2">
            <div className="relative">
              <Image
                src="/icons/cartIcon.svg"
                alt="My cart icon"
                width={16}
                height={16}
              />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#3c4948] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </div>
            <p className="text-sm font-medium">My cart</p>
          </Link>
        </div>
        <div className="w-full flex items-center gap-2">
          <Image
            src="/icons/notificationIcon.svg"
            alt="Notifications icon"
            width={16}
            height={16}
          />
          <p className="text-sm font-medium">Notifications</p>
        </div>
      </div>

      {/* Secondary actions */}
      <div className=" text-bgArmy flex items-center w-1/2 ml-24">
        <div className="w-full flex items-center gap-2">
          <Image
            src="/icons/supportIcon.svg"
            alt="Support icon"
            width={16}
            height={16}
          />
          <p className="text-sm font-medium">Support</p>
        </div>
        <div className="w-full flex items-center gap-2">
          <Image
            src="/icons/accountIcon.svg"
            alt="My account icon"
            width={16}
            height={16}
          />
          <p className="text-sm font-medium">My account</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
