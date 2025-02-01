"use client";
import React, { useState } from "react";
import { TbShoppingBag } from "react-icons/tb";
import { IoMdCloudUpload } from "react-icons/io";
import AppLayout from "../../components/AppLayout";
import Header from "../../components/Header";
import Input from "@/app/utilities/Input";
import TextArea from "@/app/utilities/TextArea";
import Select from "@/app/utilities/Select";
import { toast } from "react-toastify";
import { TiTimes } from "react-icons/ti";
import Image from "next/image";
import Button from "../../utilities/Button";
import { MdOutlineFileUpload } from "react-icons/md";

const AddProduct = () => {
  const [addProductData, setAddProductData] = useState({
    title: "",
    description: "",
    changePrice: "",
    costPrice: "",
    category: "",
    qtyInStock: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<any>(null);

  const categoryDropdown = [
    {
      value: "T-Shirt",
      name: "T-Shirt",
    },
    {
      value: "Bag",
      name: "Bag",
    },
    {
      value: "Shoe",
      name: "Shoe",
    },
  ];

  const handleChange = (field: string, value: string) => {
    setAddProductData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const { title, description, changePrice, costPrice, category, qtyInStock } =
    addProductData;

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
        <TbShoppingBag className="bg-bluePrimary2 rounded-full text-bluePrimary p-[.5rem] w-[47px] h-[47px] " />
        <div className="space-y-[.1rem]">
          <h3 className="text-black1 font-medium text-xl leading-[26.82px]">
            Add a new product
          </h3>
          <p className="bg-bluePrimary2 text-sm text-bluePrimary px-[.3rem] py-[.2rem]">
            Upload new products to your store.
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
          className="border-2 border-borderColor md:!w-[543px] rounded-[10px] p-[10px]"
          placeholder="Enter text"
        />
      </div>
      <div className="my-[2rem]">
        <h3 className="text-lg text-black1 font-medium leading-[21.94px]">
          Description
        </h3>
        <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
          Describe your product. This can include ‘size’, specs, colours etc’.
        </p>
        <TextArea
          value={description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
          className="border-2 border-borderColor  md:!w-[543px] p-[10px] h-[129px]"
          placeholder="Enter text"
        />
      </div>
      <div className="my-[2rem]">
        <h3 className="text-lg text-black1 font-medium leading-[21.94px]">
          Price
        </h3>
        <div className="flex items-center gap-[1rem]">
          <div className="">
            <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
              Add a price
            </p>
            <Input
              value={changePrice}
              onChange={(e) => handleChange("changePrice", e.target.value)}
              type="text"
              required
              className="border-2 border-borderColor w-[252px] rounded-[10px] p-[10px]"
              placeholder="NGN 0.00"
            />
          </div>
          <div className="">
            <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
              Cost price
            </p>
            <Input
              value={costPrice}
              onChange={(e) => handleChange("costPrice", e.target.value)}
              type="text"
              required
              className="border-2 border-borderColor w-[252px] rounded-[10px] p-[10px]"
              placeholder="NGN 0.00"
            />
          </div>
        </div>
      </div>
      <div className="my-[2rem]">
        <h3 className="text-lg text-black1 font-medium leading-[21.94px]">
          Category
        </h3>
        <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
          What is the quantity available?
        </p>
        <Select
          value={category}
          onChange={(e) => handleChange("category", e.target.value)}
          options={categoryDropdown}
          className="border-2 border-borderColor md:!w-[286px] !rounded-[6px] px-[10px]"
          placeHolder="Select a category"
        />
      </div>
      <div className="my-[2rem]">
        <h3 className="text-lg text-black1 font-medium leading-[21.94px]">
          Quantity in stock
        </h3>
        <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
          What is the quantity available?
        </p>
        <Input
          value={qtyInStock}
          onChange={(e) => handleChange("qtyInStock", e.target.value)}
          type="text"
          required
          className="border-2 border-borderColor md:!w-[543px] rounded-[10px] p-[10px]"
          placeholder="Enter text"
        />
      </div>
      <div className="my-[2rem]">
        <h3 className="text-lg text-black1 font-medium leading-[21.94px]">
          Add product images
        </h3>
        <p className="font-normal text-lightModeSubText leading-[19.5px] my-[.5rem] text-sm md:text-base">
          Upload images of your products
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
        Save Product
        <MdOutlineFileUpload className="h-[24px] w-[24px] lg:block" />
      </Button>
    </AppLayout>
  );
};

export default AddProduct;
