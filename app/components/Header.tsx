"use client";
import React from "react";
import Image from "next/image";
import img1 from "../image/alerm.svg";
import img3 from "../image/door.svg";
import img4 from "../image/sampleman.png";
import Button from "../utilities/Button";

const Header = () => {
  return (
    <div>
      <div className="hidden md:flex items-center justify-between h-[80px]">
        <div className="flex items-center gap-[2rem] font-medium text-[15px] leading-[38px] text-grayscalBody2"></div>
        <Button
          type="button"
          className="bg-black text-white flex items-center gap-[.2rem] lg:gap-[1rem] font-normal leading-[23.52px] text-sm lg:text-sm w-auto py-[10px] px-[10px] md:px-[15px]"
        >
          <Image src={img3} alt="switch" className="hidden lg:block" />
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
    </div>
  );
};

export default Header;
