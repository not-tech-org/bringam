"use client";

import React from "react";
import Image from "next/image";
import Input from "../common/Input";
import InputFilter from "../common/InputFilter";

const Header = () => {
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
          <Image
            src="/icons/cartIcon.svg"
            alt="My cart icon"
            width={16}
            height={16}
          />
          <p className="text-sm font-medium">My cart</p>
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
