"use client";

<<<<<<< HEAD
import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import Header from "../components/Header";
import { LuSearch } from "react-icons/lu";
import Input from "../utilities/Input";
import Select from "../utilities/Select";

const Dashboard = () => {
  const [searchText, setSearchText] = useState("");
  const [filterText, setFilterText] = useState("");

  const handleChange = (field: string, value: string) => {
    setFilterText((prevState: any) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const dropdownData = [
    {
      value: "All time",
      name: "All time",
    },
  ];

  return (
    <AppLayout>
      <Header />
      <div className="mt-[2rem]">
        <h3 className="text-[28px] font-medium leading-[18px]">Hello, James</h3>
        <p className="text-primary mt-[1rem] text-lightModeSubText">
          Here’s a look at your dashboard
        </p>
        <div className="flex items-center justify-between">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            Icon={LuSearch}
            className="w-full lg:w-[350px] rounded-[13px] mt-[1rem] h-[50px]"
            placeholder="Search"
          />
          <Select
            value={filterText}
            options={dropdownData}
            onChange={(e) => handleChange("deadline", e.target.value)}
            className=""
          />
=======
import React from "react";
import AppLayout from "../components/AppLayout";
import Header from "../components/Header";
import Wrapper from "../components/wrapper/Wrapper";
import Image from "next/image";
import Button from "../components/common/Button";
import { FaArrowRight } from "react-icons/fa";

const storeList = [
  { asset: "/images/st.png", storeName: "Store Name", tagName: "Tagname..." },
];

const offerList = [
  { asset: "/images/offer.png", storeName: "Turtle Neck", tagName: "Abike clothings", oldPrice: "N3,000", newPrice: "N2,500" },
];

function repeatElements<T>(array: T[], times: number): T[] {
  return array.flatMap((item) => Array(times).fill(item));
}
const DashboardPage = () => {
  return (
    <Wrapper>
      <div className="bg-white h-full text-black ">
        <div className="mx-auto px-4">
          <p className="text-2xl font-bold">Top stores near me</p>
          <div className="flex items-center justify-between text-textGray3 text-sm">
            <p className=" ">Best stores around your location</p>
            <div>
              <p>Filter by</p>
            </div>
          </div>

          {/* Grid */}
          <div className="overflowForced">
            {/* Store */}
            <div className="flex flex-col justify-center items-center w-full">
              <div className="grid grid-cols-4 grid-rows-2 gap-16 mt-12 mx-4">
                {repeatElements(storeList, 8)?.map((store, key) => (
                  <div className="bg-white h-60 w-44">
                    <div className="h-3/5">
                      <Image
                        src={store?.asset}
                        alt="Store icon"
                        width={183}
                        height={173}
                      />
                    </div>
                    <div className="h-2/5 flex flex-col items-center justify-center hover:border border-1 cursor-pointer hover:rotate-2 transform transition hover:shadow-lg">
                      <p className="font-bold">{store?.storeName}</p>
                      <p className="text-sm font-bold text-lighterArmy">
                        {store?.tagName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button primary style="w-fit gap-4 p-4 px-8 mt-16">
                <p>View more stores</p>
                <FaArrowRight />
              </Button>
            </div>

            {/* Weekly offers */}
            <div className="mt-12">
              <p className="text-2xl font-bold">Top offers for the week</p>
              <div className="flex items-center justify-between text-textGray3 text-sm">
                <p className=" ">The best offers from vendors around you</p>
                {/* <Button>Load</Button> */}
              </div>
              <div className="flex flex-col justify-center items-center w-full">
                <div className="grid grid-cols-4 grid-rows-2 gap-16 mt-12 mx-4">
                  {repeatElements(offerList, 8)?.map((store, key) => (
                    <div className="bg-white h-60 w-44">
                      <div className="h-3/5">
                        <Image
                          src={store?.asset}
                          alt="Store icon"
                          width={183}
                          height={173}
                        />
                      </div>
                      <div className="mt-7 h-2/5 flex flex-col items-center justify-center hover:border border-1 cursor-pointer hover:rotate-2 transform transition hover:shadow-lg">
                        <p className="font-bold">{store?.storeName}</p>
                        <p className="text-sm font-bold text-lighterArmy">
                          {store?.tagName}
                        </p>
                        <div className="flex items-center justify-between w-full px-4 pt-1">
                          <p className="text-sm font-bold text-textGray4 line-through">
                            {store?.oldPrice}
                          </p>
                          <p className="text-sm font-bold text-green">
                            {store?.newPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button primary style="w-fit gap-4 p-4 px-8 mt-16">
                  <p>View more offers</p>
                  <FaArrowRight />
                </Button>
              </div>
            </div>
          </div>
>>>>>>> b75776b434b5258bd0108cca3250e3dc3be54cea
        </div>
      </div>
    </Wrapper>
  );
};

<<<<<<< HEAD
export default Dashboard;
=======
export default DashboardPage;
>>>>>>> b75776b434b5258bd0108cca3250e3dc3be54cea
