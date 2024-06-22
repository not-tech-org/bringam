"use client";
import React, { useState } from "react";
import img1 from "../image/product-cover-1.png";
import img2 from "../image/product-cover-2.png";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import Image from "next/image";
const CustomDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const list = [
    {
      city: "New York",
      img: img1,
    },
    {
      city: "Lagos",
      img: img2,
    },
  ];
  return (
    <div className="relative flex flex-col items-center w-[340px] rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white leading-[19.5px] h-[53px] w-full flex items-center justify-between font-medium text-base rounded-lg border-2 active:border-white duration-300 active:text-white px-[1rem]">
        Add a product
        {isOpen ? (
          <AiOutlineCaretDown className="h-8" />
        ) : (
          <AiOutlineCaretUp className="h-8" />
        )}
      </button>
      {isOpen && (
        <div className="bg-borderColor absolute top-16 flex flex-col items-start rounded-lg p-2 w-full">
          {list.map((item, index) => (
            <div
              className="flex w-full items-center justify-between p-2 hover:bg-white cursor-pointer rounded-r-lg border-l-transparent hover:border-l-black1 border-l-4"
              key={index}>
              <Image
                src={item.img}
                alt={item.city}
                width={70}
                height={65}
                className="object-cover"
              />
              <h3 className="font-bolds">{item.city}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
