"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { IoMenuSharp } from "react-icons/io5";
import { AiOutlineShopping } from "react-icons/ai";
import { MdOutlinePayment } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";
import { FaRegWindowRestore } from "react-icons/fa";
import img1 from "../image/sampleman.png";
import img8 from "../image/NotificationIcon.svg";
import img9 from "../image/SettingsIcon.svg";
import img10 from "../image/SupportIcon.svg";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [hideHamburger, setHideHamburger] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const checkScreenWidth = () => {
    setIsMobile(window.innerWidth <= 768);
    if (window.innerWidth <= 768) {
      setOpen(false);
      setHideHamburger(false);
    } else {
      setOpen(true);
      setHideHamburger(false);
    }
  };

  useEffect(() => {
    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, [isMobile]);

  const pathname = usePathname();

  const SidebarDataBusiness = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <MdDashboard />,
    },
    {
      title: "Products",
      path: "/products",
      icon: <AiOutlineShopping />,
    },
    {
      title: "Payments",
      path: "#",
      icon: <MdOutlinePayment />,
    },
    {
      title: "Orders",
      path: "#",
      icon: <CgFileDocument />,
    },
    {
      title: "Store",
      path: "#",
      icon: <FaRegWindowRestore />,
    },
  ];

  const SidebarDataPersonal = [
    {
      title: "Notifications",
      path: "#",
      icon: img8,
    },
    {
      title: "Settings",
      path: "#",
      icon: img9,
    },
    {
      title: "Support",
      path: "#",
      icon: img10,
    },
  ];

  return (
    <div
      className={`bg-sidebarBg sticky top-0 h-screen bottom-0 w-[200px] md:w-[276px] flex-shrink-0 p-0 md:p-5 duration-300 ${
        !open ? "ml-[-200px]" : ""
      } relative`}>
      <div className="relative p-4 flex items-center justify-center md:justify-center">
        <Link href="/">
          <h3 className="font-bold text-[32px] leading-[48px]">Logo</h3>
        </Link>

        {!hideHamburger && (
          <IoMenuSharp
            className={`absolute cursor-pointer w-[2rem] h-[2rem] bg-white lg:hidden text-black right-[-3rem] md:right-[-3.5rem] md:top-1  ${
              !open && "rotate-180"
            }`}
            onClick={() => setOpen(!open)}
          />
        )}
      </div>
      <nav className="py-4 px-1 md:px-1 mt-[1rem] ">
        <p className="font-medium text-base leading-[19.5px] text-textGray px-[10px]">
          Business
        </p>
        <ul>
          {SidebarDataBusiness.map(({ title, path, icon }, index) => {
            const isActive = pathname.startsWith(path);
            return (
              <li
                className="transition-colors duration-300 mt-[.5rem]"
                key={index}>
                <div
                  className={`flex rounded-md cursor-pointer text-Acc1 items-center w-full justify-between h-[40px] px-[10px] py-[5px]
                  ${
                    isActive
                      ? "bg-bgActive border-2 border-bluePrimary text-bluePrimary"
                      : "bg-transparent"
                  }
              `}>
                  <Link href={path} className="flex items-center gap-2">
                    <div
                      className={`${
                        isActive ? "text-bluePrimary" : "text-textGray"
                      }  w-[23.73px] `}>
                      {icon}
                    </div>
                    <span
                      className={`origin-left duration-200 text-sm md:text-[15px] leading-[19.5px] font-medium ${
                        isActive ? "text-bluePrimary" : "text-textGray"
                      }  `}>
                      {title}
                    </span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <hr className="my-[2rem] h-[3px]" />
        <p className="font-medium text-base leading-[19.5px] text-textGray px-[10px]">
          Personal
        </p>
        {/* <ul>
          {SidebarDataPersonal.map(({ title, path, icon }, index) => {
            const isActive = pathname.startsWith(path);

            return (
              <li
                className="transition-colors duration-300 mt-[.5rem]"
                key={index}>
                <div
                  className={`flex rounded-md cursor-pointer text-Acc1 items-center w-full justify-between h-[40px] px-[10px] py-[5px] mt-[]`}>
                  <Link href={path} className="flex items-center gap-2">
                    <div
                      className={`${
                        isActive ? "text-bluePrimary" : "text-textGray"
                      }  w-[23.73px] h-[22.5px] `}>
                      {icon}
                    </div>
                    <span className="origin-left duration-200 text-sm md:text-[15px] leading-[19.5px] font-medium  text-textGray">
                      {title}
                    </span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul> */}
      </nav>
      <div className="flex items-center px-[0px] absolute bottom-8 gap-[.5rem]">
        <Image
          src={img1}
          alt="Description of image"
          className="w-[47.76px] h-[47.76px] hidden md:block"
        />
        <div className="hidden lg:block ">
          <div className="flex items-center w-[160px] justify-between">
            <h3 className="text-base font-medium leading-[20.52px] text-black1">
              James Audu
            </h3>
            <MdKeyboardArrowRight className="text-black " />
          </div>
          <p className="text-black1 font-normal text-sm leading-[24px] overflow-scroll">
            Jamesglover24@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
