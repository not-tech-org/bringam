import React from "react";
import { FiPieChart } from "react-icons/fi";
import { RiInformationLine } from "react-icons/ri";

interface IProductCardUp {
  text: string;
  amount: string;
  timeFrame?: string;
}
export const ProductCardUp: React.FC<IProductCardUp> = ({
  text,
  amount,
  timeFrame,
}) => {
  return (
    <div className="border-[2px] border-borderColor rounded-[8px] w-[307px] h-[148px] p-[1rem] flex items-start flex-col justify-between">
      <FiPieChart className="rounded-[8px] bg-iconBg text-lightFadedBlue p-[.2rem] w-[30px] h-[29px]" />
      <div className="flex items-center gap-[.5rem] text-lightModeSubText ">
        <p className="text-base font-medium leading-[19.5px]">{text}</p>
        <RiInformationLine className="w-[16.13px]" />
      </div>
      <div className="flex items-end justify-between w-full">
        <h3 className="text-[23px] font-medium text-black">{amount}</h3>
        <p className="text-lightModeSubText text-sm">{timeFrame}</p>
      </div>
    </div>
  );
};


interface IProductCardDown {
  text: string;
  amount: string;
  timeFrame?: string;
}

export const ProductCardDown: React.FC<IProductCardDown> = ({
  text,
  amount,
  timeFrame,
}) => {
  return (
    <div className="border-[2px] border-borderColor rounded-[8px] w-[307px] h-[104px] p-[1rem] flex items-start flex-col justify-between">
      <div className="flex items-center gap-[.5rem] text-lightModeSubText ">
        <p className="text-base font-medium leading-[19.5px]">{text}</p>
        <RiInformationLine className="w-[16.13px]" />
      </div>
      <div className="flex items-end justify-between w-full">
        <h3 className="text-[23px] font-medium text-black">{amount}</h3>
        <p className="text-lightModeSubText text-sm">{timeFrame}</p>
      </div>
    </div>
  );
};
