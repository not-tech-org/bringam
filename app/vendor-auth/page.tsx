"use client";

import React, { ChangeEvent, useState } from "react";
import { RxExit } from "react-icons/rx";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Image from "next/image";
import Select from "../components/common/Select";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import { becomeVendorApi } from "../services/AuthService";
import { showToast, validateEmail } from "../components/utils/helperFunctions";
import { businessCategoryDropdownData } from "../components/common/BringAmData";
import MultiSelectDropdown from "../components/common/MultiSelectDropdown";
import { MdDelete, MdOutlineCancel } from "react-icons/md";
import TruncatedText from "../components/common/TruncatedText";
import { toast } from "react-toastify";
import { PiUploadSimpleBold } from "react-icons/pi";
import { TiTimes } from "react-icons/ti";
import { useRouter } from "next/navigation";

interface StateType {
  businessName: string;
  categories: { value: string; label: string }[];
  imageFile: string;
}

interface IListOfCategory {
  value: string;
  label: string;
}

const VendorAuth = () => {
  const [formData, setFormData] = useState<StateType>({
    businessName: "",
    categories: [],
    imageFile: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { businessName, categories, imageFile } = formData;

  console.log(formData);
  const router = useRouter();

  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];
  const maxSize = 3 * 1024 * 1024; // 3MB in bytes

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files } = event.target as HTMLInputElement;

    if (type === "file" && files) {
      const file = files[0]; // Accept only 1 file

      if (!allowedFileTypes.includes(file.type)) {
        return toast.error(
          "Invalid file type. Allowed types: JPG, JPEG, PNG, PDF"
        );
      }

      if (file.size > maxSize) {
        return toast.error("File exceeds the 3MB size limit");
      }

      // Convert file to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1]; // Remove data URL prefix
        setFormData((prevState) => ({
          ...prevState,
          imageFile: base64String, // Store Base64 string
        }));
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSelect = (selectedOptions: IListOfCategory[]) => {
    setFormData((prevState: any) => ({
      ...prevState,
      categories: selectedOptions.map((option) => option),
    }));
  };

  const handleRemoveFile = () => {
    setFormData((prevState) => ({
      ...prevState,
      imageFile: "", // Reset Base64 string
    }));
    setFileName(null); // Reset file name
  };

  const onBecomeAVendor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName) {
      return showToast("Business name cannot be empty", "error");
    }

    if (categories.length === 0) {
      return showToast("Category cannot be empty", "error");
    }

    if (!imageFile) {
      return showToast("Business document cannot be empty", "error");
    }

    const formApiData = {
      businessName,
      categories: categories.map((category) => category.value),
      idDoc: imageFile,
    };

    setIsLoading(true);

    try {
      const res = await becomeVendorApi(formApiData);

      showToast(res.data.message, "success");
      router.push("/dashboard");

      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);

      if (err.response) {
        showToast(err.response.data.message || "An error occurred", "error");
      } else {
        showToast("Network error or timeout", "error");
      }
      console.log(err);
    }
  };

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
          <form className="w-1/2" onSubmit={onBecomeAVendor}>
            <Input
              label="Business name"
              type="text"
              name="businessName"
              id="businessName"
              value={businessName}
              onChange={handleInputChange}
              placeholder="Enter first name"
              className="border-gray-300 rounded w-100 mb-3"
            />
            <div className="my-[1rem]">
              <h5
                className="text-grayscalBody2 mb-2
              text-black3 text-base font-semibold">
                Category
              </h5>
              <MultiSelectDropdown
                options={businessCategoryDropdownData}
                onSelect={handleSelect}
                className="!w-full bg-white !rounded-[1rem] border border-secondaryInput "
                placeholder="Add or Remove"
                existingSeleted={categories}
              />
            </div>
            {categories.length > 0 && (
              <div className="flex items-center justify-start flex-wrap w-full gap-2  overflow-x-scroll">
                {businessCategoryDropdownData
                  .filter((item: any) =>
                    categories.some((dept) => dept.value === item.value)
                  )
                  .map((item) => (
                    <div
                      className="flex items-center justify-between gap-x-2 rounded-full py-[8px] px-[8px] bg-grayscalBg border-2 border-borderColor w-fit"
                      key={item.value}>
                      <h4 className="text-sm text-primary font-medium leading-[16px]">
                        {item.label}
                      </h4>
                    </div>
                  ))}
              </div>
            )}

            <div className="my-[1.5rem]">
              <label
                className="leading-[16px] mb-2 text-black3 text-base font-semibold
              ">
                Attachment
              </label>
              <div
                className="relative flex items-center justify-center text-sm 
                      border-dashed border-2 border-bgArmy rounded-[6px] w-full h-[121px]
                     ">
                {fileName ? (
                  <>
                    <div className="absolute top-0 right-0 cursor-pointer">
                      <TiTimes
                        className="text-[20px] text-white bg-red-500 rounded-full p-1"
                        onClick={handleRemoveFile}
                      />
                    </div>

                    <div className="text-center">
                      <div>
                        <TruncatedText
                          text={fileName}
                          maxWords={3}
                          maxLetters={15}
                          className="text-sm flex-[.7]"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-md">
                    <label
                      htmlFor="file-input"
                      className="text-center font-normal text-base leading-[20px] flex items-center justify-center flex-col py-[1rem] text-primary px-2 gap-[.5rem] cursor-pointer ">
                      <PiUploadSimpleBold className="text-[24px] text-primary" />
                      Click to attach
                    </label>
                  </div>
                )}
                <input
                  type="file"
                  name="imageFile"
                  accept=".jpg, .jpeg, .png, .pdf"
                  id="file-input"
                  className="hidden"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {isLoading ? (
              <Button type="button" primary className="" disabled>
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              </Button>
            ) : (
              <Button type="submit" primary>
                Continue
              </Button>
            )}
          </form>
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
};

export default VendorAuth;
