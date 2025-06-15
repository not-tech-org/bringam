"use client";

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
  {
    asset: "/images/offer.png",
    storeName: "Turtle Neck",
    tagName: "Abike clothings",
    oldPrice: "N3,000",
    newPrice: "N2,500",
  },
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
          <div className="custom-scrollbar">
            {/* Store */}
            <div className="flex flex-col justify-center items-center w-full">
              <div className="grid grid-cols-4 grid-rows-2 gap-16 mt-12 mx-4">
                {repeatElements(storeList, 8)?.map((store, key) => (
                  <div className="bg-white h-60 w-44" key={key}>
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
              <Button type="button" primary style="w-fit gap-4 p-4 px-8 mt-16">
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
                    <div className="bg-white h-60 w-44" key={key}>
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
                <Button
                  type="button"
                  primary
                  style="w-fit gap-4 p-4 px-8 mt-16"
                >
                  <p>View more offers</p>
                  <FaArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default DashboardPage;
