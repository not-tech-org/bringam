import Wrapper from '@/app/components/wrapper/Wrapper';
import React from 'react'
import { BsBag } from 'react-icons/bs';
import { AiOutlinePieChart } from "react-icons/ai";

const IndividualStore = () => {
  return (
    <Wrapper>
      <p className="mb-4 font-semibold text-lg">Overview</p>
      <div className="flex items-center justify-between gap-8">
        <div className="border-2 border-[#EEEEEE] w-full rounded-lg p-4 shadow">
          <AiOutlinePieChart size={28} color="#9193EB" />
          <div className="flex items-center gap-2 my-4">
            <BsBag color="#747474" />
            <p className="text-sm text-lightModeSubText font-medium">
              Active products
            </p>
          </div>
          <p className="text-3xl font-medium">24</p>
        </div>
        <div className="border-2 border-[#EEEEEE] w-full rounded-lg p-4 shadow">
          <AiOutlinePieChart size={28} color="#9193EB" />
          <div className="flex items-center gap-2 my-4">
            <BsBag color="#747474" />
            <p className="text-sm text-lightModeSubText font-medium">
              Members
            </p>
          </div>
          <p className="text-3xl font-medium">4</p>
        </div>
        <div className="border-2 border-[#EEEEEE] w-full rounded-lg p-4 shadow">
          <AiOutlinePieChart size={28} color="#9193EB" />
          <div className="flex items-center gap-2 my-4">
            <BsBag color="#747474" />
            <p className="text-sm text-lightModeSubText font-medium">
              Orders
            </p>
          </div>
          <p className="text-3xl font-medium">24</p>
        </div>
      </div>
    </Wrapper>
  );
}

export default IndividualStore;