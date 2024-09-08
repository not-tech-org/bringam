import React from "react";
import AppLayout from "../components/AppLayout";
import Header from "../components/Header";

const page = () => {
  return (
    <AppLayout>
      <Header />
      <div className="mt-[2rem]">
        <h3 className="text-[28px] font-medium leading-[18px]">Hello, James</h3>
        <p className="text-primary mt-[1rem] text-lightModeSubText">Here’s a look at your dashboard</p>
      </div>
    </AppLayout>
  );
};

export default page;
