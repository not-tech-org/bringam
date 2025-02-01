"use client"

import React from 'react'
import { RxExit } from 'react-icons/rx';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Image from 'next/image';
import Select from '../components/common/Select';

const VendorAuth = () => {
  return (
    <div className="text-black w-full h-full">
      <div className="flex items-center justify-between p-8 px-20">
        <p className="font-bold text-2xl">Bringam</p>
        <div className="flex">
          <div className="flex items-center justify-between bg-black text-white gap-3 p-2 px-4 rounded-lg">
            <RxExit />
            <p>Switch to customer</p>
          </div>
        </div>
      </div>

      <div className="p-8 px-28">
        {/* Header */}
        <div className="w-fit">
          <p className="font-semibold text-xl ">Become a vendor</p>
          <div className="p-2 bg-[#F0FFFE] text-xs mt-1">
            Basic vendor data is required to create a new vendor profile.
          </div>
        </div>

        <div className="flex items-center justify-between gap-32 p-16 h-full">
          <div className="w-1/2">
            <Input
              label="First name"
              type="text"
              name="lastName"
              id="lastName"
              value={""}
              onChange={() => console.log("Test")}
              placeholder="Enter first name"
              className="border-gray-300 rounded w-100 mb-3"
            />
            <Input
              label="Last name"
              type="text"
              name="lastName"
              id="lastName"
              value={""}
              onChange={() => console.log("Test")}
              placeholder="abc@gmail.com"
              className="border-gray-300 rounded w-100 mb-3"
            />
            <Input
              label="Email"
              type="text"
              name="lastName"
              id="lastName"
              value={""}
              onChange={() => console.log("Test")}
              placeholder="abc@gmail.com"
              className="border-gray-300 rounded w-100 mb-3"
            />
            <Input
              label="Business name"
              type="text"
              name="lastName"
              id="lastName"
              value={""}
              onChange={() => console.log("Test")}
              placeholder="Enter first name"
              className="border-gray-300 rounded w-100 mb-3"
            />
            <div>
              <Select
                label="Category"
                name="category"
                value={""}
                options={[]}
                onChange={() => console.log()}
                required
                placeholder='Select a category'
              />
            </div>
            <Button primary style="">
              Continue
            </Button>
          </div>
          <div className="w-1/2 h-full">
            <div className=" w-full h-full">
              <Image
                src="/images/vendor.png"
                width={480}
                height={652}
                alt="Vendor"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorAuth