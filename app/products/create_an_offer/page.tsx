"use client";
import AppLayout from "@/app/components/AppLayout";
import Header from "@/app/components/Header";
import Button from "@/app/utilities/Button";
import Input from "@/app/utilities/Input";
import Image from "next/image";
import React, { useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { IoGiftOutline } from "react-icons/io5";
import { MdOutlineFileUpload } from "react-icons/md";
import { TiTimes } from "react-icons/ti";
import { toast } from "react-toastify";

const CreateOffer = () => {
  const [createOfferData, setCreateOfferData] = useState({
    title: "",
    totalPrice: "",
    discountedPrice: "",
    discountedPercentage: "",
    offerStartDate: "",
    offerEndDate: "",
    totalInStock: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<any>(null);

  const handleChange = (field: string, value: string) => {
    setCreateOfferData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const {
    title,
    totalPrice,
    discountedPrice,
    discountedPercentage,
    offerStartDate,
    offerEndDate,
    totalInStock,
  } = createOfferData;

  const handleCancelImage = () => {
    setProductImage(null);
    setImagePreview(null);
  };

  const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (allowedFileTypes.includes(file.type)) {
        const maxSize = 1 * 1024 * 1024; // 1MB in bytes
        if (file.size <= maxSize) {
          setProductImage(file);
          setImagePreview(URL.createObjectURL(file));
        } else {
          toast.error("File size exceeded 1MB");
        }
      } else {
        toast.error("Invalid file type. Allowed types: PNG, JPG, JPEG");
      }
    }
  };

  return (
    <AppLayout>
      <Header />
      <div className="flex items-center gap-4">
        <IoGiftOutline className="bg-bluePrimary2 rounded-full text-bluePrimary p-[.5rem] w-[47px] h-[47px] " />
        <div className="space-y-[.1rem]">
          <h3 className="text-black1 font-medium text-xl leading-[26.82px]">
            Create an offer
          </h3>
          <p className="bg-bluePrimary2 text-sm text-bluePrimary px-[.3rem] py-[.2rem]">
            Offers enables customers to buy products at subsidized prices
          </p>
        </div>
      </div>
      <div className="my-[2rem]">
        <h3 className="text-lg text-black1 font-medium leading-[21.94px]">
          Product title
        </h3>
        <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
          This will be displayed as the name of your product.
        </p>
        <Input
          value={title}
          onChange={(e) => handleChange("title", e.target.value)}
          type="text"
          required
          className=" md:!w-[543px] rounded-[10px] p-[10px]"
          placeholder="Enter text"
        />
      </div>
      <div className="my-[2rem] grid grid-cols-2 md:grid-cols-3 items-center gap-[1rem]">
        <div>
          <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
            Total Price
          </p>
          <Input
            value={totalPrice}
            onChange={(e) => handleChange("totalPrice", e.target.value)}
            type="text"
            required
            className=" md:!w-[252px] rounded-[10px] p-[10px]"
            placeholder="NGN 0.00"
          />
        </div>
        <div>
          <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
            Discounted Price
          </p>
          <Input
            value={discountedPrice}
            onChange={(e) => handleChange("discountedPrice", e.target.value)}
            type="text"
            required
            className=" md:!w-[252px] rounded-[10px] p-[10px]"
            placeholder="NGN 0.00"
          />
        </div>
        <div>
          <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
            Discount Percentage %
          </p>
          <Input
            value={discountedPercentage}
            onChange={(e) =>
              handleChange("discountedPercentage", e.target.value)
            }
            type="text"
            required
            className=" md:!w-[141px] rounded-[10px] p-[10px]"
            placeholder="NGN 0.00"
          />
        </div>
      </div>
      <div className="my-[2rem] ">
        <h3 className="text-black1 font-medium text-xl leading-[26.82px]">
          Duration
        </h3>
        <div className="flex items-center gap-[2rem]">
          <div>
            <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
              When does this offer start?
            </p>
            <Input
              value={offerStartDate}
              onChange={(e) => handleChange("offerStartDate", e.target.value)}
              type="date"
              required
              className=" md:!w-[205px] rounded-[10px] p-[10px]"
              placeholder="DD / MM / YYYY"
            />
          </div>
          <div>
            <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
              When does this offer end?
            </p>
            <Input
              value={offerEndDate}
              onChange={(e) => handleChange("offerEndDate", e.target.value)}
              type="date"
              required
              className=" md:!w-[205px] rounded-[10px] p-[10px]"
              placeholder="DD / MM / YYYY"
            />
          </div>
        </div>
      </div>
      <div className="my-[2rem]">
        <h3 className="text-lg text-black1 font-medium leading-[21.94px]">
          Total in stock
        </h3>
        <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
          Total number of items in stock for this offer
        </p>
        <Input
          value={totalInStock}
          onChange={(e) => handleChange("totalInStock", e.target.value)}
          type="text"
          required
          className=" md:!w-[228px] rounded-[10px] p-[10px]"
          placeholder="00"
        />
      </div>
      <div className="my-[2rem]">
        <h3 className="text-lg text-black1 font-medium leading-[21.94px]">
          Background image
        </h3>
        <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
          ( .JPG, .JPEG, .PNG )
        </p>
        <div
          className={`relative flex-1 border-2 border-borderColor
          rounded-md h-[250px] flex items-center justify-center flex-col md:w-[536px]`}
        >
          <div className="flex items-center justify-center text-sm">
            {imagePreview ? (
              <div className="rounded-md">
                <Image
                  src={imagePreview}
                  alt="Uploaded"
                  className="h-[180px] w-[180px] object-cover"
                  width={180}
                  height={180}
                />
                <div className="absolute top-1 right-1 cursor-pointer">
                  <TiTimes
                    className="text-[20px] text-white bg-red-500 rounded-full p-1"
                    onClick={handleCancelImage}
                  />
                </div>
              </div>
            ) : (
              <label
                htmlFor="file-input"
                className="text-center font-normal text-sm leading-[20px] flex items-center justify-center flex-col py-[1rem] gap-y-[.5rem] cursor-pointer"
              >
                <IoMdCloudUpload className="text-[24px] text-bluePrimary" />
                <p className="text-sm font-medium text-bluePrimary">
                  Click to upload
                </p>
                <p className="text-xs font-normal text-lightModeSubText w-[264px]">
                  Accepted file formats: .jpg, .jpeg, and .png. 1 mb max size.
                </p>
              </label>
            )}
            <input
              type="file"
              className="hidden"
              value={productImage}
              name="image"
              id="file-input"
              onChange={(e) => handleImageChange(e)}
            />
          </div>
        </div>
      </div>
      <Button
        type="button"
        className="bg-black text-white flex items-center gap-[.2rem] lg:gap-[1rem] font-normal leading-[23.52px] text-sm lg:text-sm w-auto py-[10px] px-[10px] md:px-[15px] my-[1rem]"
      >
        Create offer
      </Button>
    </AppLayout>
  );
};

export default CreateOffer;
