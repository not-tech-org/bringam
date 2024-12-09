"use client";

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
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
