import React from "react";
import AppLayout from "../components/AppLayout";
import Header from "../components/Header";
import Wrapper from "../components/wrapper/Wrapper";
import Image from "next/image";

const page = () => {
  return (
    <Wrapper>
      <div className="bg-white h-full text-black">
        <div className="mx-auto p-16 px-32">
          <p className="text-2xl font-bold">Top stores near me</p>
          <div className="flex items-center justify-between text-textGray3 text-sm">
            <p className=" ">Best stores around your location</p>
            <div>
              <p>Filter by</p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 mt-12 mx-4">
            <div className="bg-white h-60 w-44">
              <div className="h-3/5">
                <Image
                  src="/images/st.png"
                  alt="Store icon"
                  width={183}
                  height={173}
                />
              </div>
              <div className="h-2/5 flex flex-col items-center justify-center hover:border border-1 cursor-pointer hover:rotate-2 transform transition hover:shadow-lg">
                <p className="font-bold">Store Name</p>
                <p className="text-sm font-bold text-lighterArmy">Tagname...</p>
              </div>
            </div>
            <div className="bg-white h-60 w-44">
              <div className="h-3/5">
                <Image
                  src="/images/st.png"
                  alt="Store icon"
                  width={183}
                  height={173}
                />
              </div>
              <div className="h-2/5 flex flex-col items-center justify-center hover:border border-1 cursor-pointer hover:rotate-2 transform transition hover:shadow-lg">
                <p className="font-bold">Store Name</p>
                <p className="text-sm font-bold text-lighterArmy">Tagname...</p>
              </div>
            </div>
            <div className="bg-white h-60 w-44">
              <div className="h-3/5">
                <Image
                  src="/images/st.png"
                  alt="Store icon"
                  width={183}
                  height={173}
                />
              </div>
              <div className="h-2/5 flex flex-col items-center justify-center hover:border border-1 cursor-pointer hover:rotate-2 transform transition hover:shadow-lg">
                <p className="font-bold">Store Name</p>
                <p className="text-sm font-bold text-lighterArmy">Tagname...</p>
              </div>
            </div>
            <div className="bg-white h-60 w-44">
              <div className="h-3/5">
                <Image
                  src="/images/st.png"
                  alt="Store icon"
                  width={183}
                  height={173}
                />
              </div>
              <div className="h-2/5 flex flex-col items-center justify-center hover:border border-1 cursor-pointer hover:rotate-2 transform transition hover:shadow-lg">
                <p className="font-bold">Store Name</p>
                <p className="text-sm font-bold text-lighterArmy">Tagname...</p>
              </div>
            </div>
            <div className="bg-white h-60 w-44">
              <div className="h-3/5">
                <Image
                  src="/images/st.png"
                  alt="Store icon"
                  width={183}
                  height={173}
                />
              </div>
              <div className="h-2/5 flex flex-col items-center justify-center hover:border border-1 cursor-pointer hover:rotate-2 transform transition hover:shadow-lg">
                <p className="font-bold">Store Name</p>
                <p className="text-sm font-bold text-lighterArmy">Tagname...</p>
              </div>
            </div>
            <div className="bg-white h-60 w-44">
              <div className="h-3/5">
                <Image
                  src="/images/st.png"
                  alt="Store icon"
                  width={183}
                  height={173}
                />
              </div>
              <div className="h-2/5 flex flex-col items-center justify-center hover:border border-1 cursor-pointer hover:rotate-2 transform transition hover:shadow-lg">
                <p className="font-bold">Store Name</p>
                <p className="text-sm font-bold text-lighterArmy">Tagname...</p>
              </div>
            </div>
            <div className="bg-white h-60 w-44">
              <div className="h-3/5">
                <Image
                  src="/images/st.png"
                  alt="Store icon"
                  width={183}
                  height={173}
                />
              </div>
              <div className="h-2/5 flex flex-col items-center justify-center hover:border border-1 cursor-pointer hover:rotate-2 transform transition hover:shadow-lg">
                <p className="font-bold">Store Name</p>
                <p className="text-sm font-bold text-lighterArmy">Tagname...</p>
              </div>
            </div>
            <div className="bg-white h-60 w-44">
              <div className="h-3/5">
                <Image
                  src="/images/st.png"
                  alt="Store icon"
                  width={183}
                  height={173}
                />
              </div>
              <div className="h-2/5 flex flex-col items-center justify-center hover:border border-1 cursor-pointer hover:rotate-2 transform transition hover:shadow-lg">
                <p className="font-bold">Store Name</p>
                <p className="text-sm font-bold text-lighterArmy">Tagname...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
