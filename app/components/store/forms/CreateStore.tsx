import Image from "next/image";
import React, { useState } from "react";
import Input from "../../common/Input";
import Select from "../../common/Select";
import Button from "../../common/Button";

const CreateStore = () => {
  const [step, setStep] = useState(1);

  return (
    <>
      {step === 0 ? (
        <div>
          <div className="h-32 rounded-lg bg-[#F6F6F6] flex items-center justify-center bg-[url('/icons/storeIcon.svg')] bg-cover bg-center">
            {/* <Image
              src="/icons/storeIcon.svg"
              alt="Store icon"
              width={50}
              height={50}
            /> */}
          </div>
          <div className="p-8">
            <p className="font-semibold text-[#271303] text-xl mt-2">
              Create new store
            </p>
            <p className="text-[#7F7F7F] text-sm my-2">
              Reach customers on the go. Your store will be optimized for
              mobile, ensuring a seamless experience for users on all devices.
            </p>
            <Input
              label="Store name"
              type="text"
              name="storeName"
              id="storeName"
              value={""}
              onChange={() => console.log("Test")}
              placeholder="What is the name of your store?"
              className="border-gray-300 rounded w-100 mb-3"
            />
            <Input
              label="Description"
              type="text"
              name="description"
              id="description"
              value={""}
              onChange={() => console.log("Test")}
              placeholder="Describe your store"
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
                placeholder="Select a category"
              />
            </div>
            <div className="flex items-center justify-between gap-8">
              <Button type="button" secondary style="border-2">
                Back
              </Button>
              <Button type="button" primary>
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="h-32 rounded-lg bg-[#F6F6F6] flex items-center justify-center bg-[url('/icons/locationIcon.svg')] bg-cover bg-center">
            {/* <Image
              src="/icons/testLocationIcon.svg"
              alt="Store icon"
              width={50}
              height={50}
            /> */}
          </div>
          <div className="p-8">
            <p className="font-semibold text-[#271303] text-xl mt-2">
              Store's location
            </p>
            <p className="text-[#7F7F7F] text-sm my-2">
              Please enter your store’s address
            </p>
            <Input
              label="Street"
              type="text"
              name="street"
              id="street"
              value={""}
              onChange={() => console.log("Test")}
              placeholder="Enter text"
              className="border-gray-300 rounded w-100 mb-3"
            />
            <Input
              label="Town"
              type="text"
              name="town"
              id="town"
              value={""}
              onChange={() => console.log("Test")}
              placeholder="Enter text"
              className="border-gray-300 rounded w-100 mb-3"
            />
            <Input
              label="City"
              type="text"
              name="city"
              id="city"
              value={""}
              onChange={() => console.log("Test")}
              placeholder="Enter text"
              className="border-gray-300 rounded w-100 mb-3"
            />
            {/* <div>
              <Select
                label="Category"
                name="category"
                value={""}
                options={[]}
                onChange={() => console.log()}
                required
                placeholder="Select a category"
              />
            </div> */}
            <div className="flex items-center justify-between gap-8">
              <Button type="button" secondary style="border-2">
                Back
              </Button>
              <Button type="button" primary>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateStore;
