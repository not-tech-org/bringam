"use client"

import React from "react";
import Input from "../common/Input";
import InputFilter from "../common/InputFilter";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-center p-8 px-16 bg-offWhite border-b-2 border-[#EEEEEE]">
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
          <img src="/icons/orderIcon.svg" />
          <p className="text-base font-medium">My orders</p>
        </div>
        <div className="w-full flex items-center gap-2">
          <img src="/icons/cartIcon.svg" />
          <p className="text-base font-medium">My cart</p>
        </div>
        <div className="w-full flex items-center gap-2">
          <img src="/icons/notificationIcon.svg" />
          <p className="text-base font-medium">Notifications</p>
        </div>
      </div>

      {/* Secondary actions */}
      <div className=" text-bgArmy flex items-center w-1/2 ml-24">
        <div className="w-full flex items-center gap-2">
          <img src="/icons/supportIcon.svg" />
          <p className="text-base font-medium">Support</p>
        </div>
        <div className="w-full flex items-center gap-2">
          <img src="/icons/accountIcon.svg" />
          <p className="text-base font-medium">My account</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
