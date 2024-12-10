import React from "react";
import AppLayout from "../components/AppLayout";
import Header from "../components/Header";
import Wrapper from "../components/wrapper/Wrapper";

const page = () => {
  return (
    <Wrapper>
      <div className="bg-white h-full">
        <h3 className="text-[28px] font-medium leading-[18px]">Hello, James</h3>
        <p className="text-primary mt-[1rem] text-lightModeSubText">
          Here’s a look at your dashboard
        </p>
      </div>
    </Wrapper>
  );
};

export default page;
