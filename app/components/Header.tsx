"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import Input from "../utilities/Input";
import img1 from "../image/alerm.svg";
import img2 from "../image/SettingsIcon.svg";
import img3 from "../image/door.svg";
import img4 from "../image/sampleman.png";

import Button from "../utilities/Button";

const Header = () => {
  const [searchText, setSearchText] = useState("");
  return (
    <>
      <div className="hidden md:flex items-center justify-between h-[80px]">
        <div className="flex items-center gap-[2rem] font-medium text-[15px] leading-[38px] text-grayscalBody2">
          <div className="bg-searchBg">
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              Icon={CiSearch}
              className="w-full lg:w-[445px] rounded-[20px]"
              placeholder="Search"
            />
          </div>
          <Image src={img2} alt="alarm" />
        </div>
        <Button
          type="button"
          className="bg-black text-white flex items-center gap-[.2rem] lg:gap-[1rem] font-normal leading-[23.52px] text-sm lg:text-sm w-auto">
          <Image src={img3} alt="alarm" className="hidden lg:block" />
          Switch to customer
        </Button>
      </div>
      <div className="md:hidden flex items-center justify-end h-[80px] gap-4">
        <Image src={img1} alt="alarm" />
        <Image
          src={img4}
          alt="Description of image"
          className="w-[37.76px] h-[37.76px]"
        />
      </div>
    </>
  );
};

export default Header;


//$result = accessBankmz_GetCustomerDetailsUsingAccountNumber("uid124","req123465666918","0812224345");



