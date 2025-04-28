"use client";

import React, { ChangeEvent, useState } from "react";
import { RxExit } from "react-icons/rx";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Image from "next/image";
import { becomeVendorApi } from "../services/AuthService";
import { businessCategoryDropdownData } from "../components/common/BringAmData";
import MultiSelectDropdown from "../components/common/MultiSelectDropdown";
import TruncatedText from "../components/common/TruncatedText";
import { PiUploadSimpleBold } from "react-icons/pi";
import { TiTimes } from "react-icons/ti";
import { useRouter } from "next/navigation";
import Toastify from "toastify-js";

interface StateType {
  businessName: string;
  categories: { value: string; label: string }[];
  imageFile: string;
}

interface IListOfCategory {
  value: string;
  label: string;
}

// Toast configuration constants - matching other components
const TOAST_STYLES = {
  success: {
    backgroundColor: "#ECFDF3", // Subtle green
    textColor: "#027A48", // Dark green
    icon: "✓",
  },
  error: {
    backgroundColor: "#FEF3F2", // Subtle red
    textColor: "#B42318", // Dark red
    icon: "✕",
  },
  warning: {
    backgroundColor: "#FFFAEB", // Subtle yellow
    textColor: "#B54708", // Dark yellow/orange
    icon: "⚠",
  },
};

const VendorAuth = () => {
  const [formData, setFormData] = useState<StateType>({
    businessName: "",
    categories: [],
    imageFile: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    businessName?: string;
    categories?: string;
    imageFile?: string;
  }>({});

  const { businessName, categories, imageFile } = formData;
  const router = useRouter();

  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];
  const maxSize = 3 * 1024 * 1024; // 3MB in bytes

  // Show toast notifications with consistent styling
  const showToast = (
    message: string,
    type: "success" | "error" | "warning" = "success"
  ) => {
    const style = TOAST_STYLES[type];

    Toastify({
      text: `${style.icon} ${message}`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: style.backgroundColor,
      className: "rounded-lg border",
      style: {
        color: style.textColor,
        border: `1px solid ${style.textColor}20`,
        fontWeight: "500",
        minWidth: "300px",
      },
      stopOnFocus: true,
    }).showToast();
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files } = event.target as HTMLInputElement;

    // Clear error when user interacts with the field
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }

    if (type === "file" && files) {
      const file = files[0]; // Accept only 1 file

      if (!allowedFileTypes.includes(file.type)) {
        setErrors({
          ...errors,
          imageFile: "Invalid file type. Allowed types: JPG, JPEG, PNG, PDF",
        });
        showToast(
          "Invalid file type. Allowed types: JPG, JPEG, PNG, PDF",
          "error"
        );
        return;
      }

      if (file.size > maxSize) {
        setErrors({
          ...errors,
          imageFile: "File exceeds the 3MB size limit",
        });
        showToast("File exceeds the 3MB size limit", "error");
        return;
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
    // Clear error when user selects categories
    if (errors.categories) {
      setErrors({ ...errors, categories: undefined });
    }

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

  // Validate form before submission
  const validateForm = () => {
    const newErrors: {
      businessName?: string;
      categories?: string;
      imageFile?: string;
    } = {};
    let isValid = true;

    if (!businessName.trim()) {
      newErrors.businessName = "Business name is required";
      isValid = false;
    }

    if (categories.length === 0) {
      newErrors.categories = "At least one category is required";
      isValid = false;
    }

    if (!imageFile) {
      newErrors.imageFile = "Business document is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onBecomeAVendor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show only one error message to avoid overwhelming the user
      const errorKey = Object.keys(errors)[0] as keyof typeof errors;
      if (errorKey && errors[errorKey]) {
        showToast(errors[errorKey]!, "error");
      }
      return;
    }

    const formApiData = {
      businessName,
      categories: categories.map((category) => category.value),
      idDoc: imageFile,
    };

    setIsLoading(true);

    try {
      const res = await becomeVendorApi(formApiData);

      if (res.data && res.data.message) {
        showToast(res.data.message, "success");
      } else {
        showToast(
          "Your vendor account has been created successfully",
          "success"
        );
      }

      // Redirect to dashboard after showing success message
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      let errorMessage = "Failed to create vendor account. Please try again.";

      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }

      showToast(errorMessage, "error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToCustomer = () => {
    // Navigate to customer dashboard
    router.push("/dashboard");
  };

  return (
    <div className="text-black w-full h-full">
      <div className="flex items-center justify-between p-8 px-20">
        <p className="font-bold text-2xl">Bringam</p>
        <div className="flex">
          <button
            onClick={handleSwitchToCustomer}
            className="flex items-center justify-between bg-black text-white gap-3 p-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <RxExit />
            <p>Switch to customer</p>
          </button>
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
              placeholder="Enter business name"
              className="border-gray-300 rounded w-100 mb-3"
              error={errors.businessName}
            />
            <div className="my-[1rem]">
              <h5
                className="text-grayscalBody2 mb-2
              text-black3 text-base font-semibold"
              >
                Category
              </h5>
              <MultiSelectDropdown
                options={businessCategoryDropdownData}
                onSelect={handleSelect}
                className="!w-full bg-white !rounded-[1rem] border border-secondaryInput"
                placeholder="Add or Remove"
                existingSeleted={categories}
              />
              {errors.categories && (
                <p className="text-red-500 text-xs mt-1">{errors.categories}</p>
              )}
            </div>
            {categories.length > 0 && (
              <div className="flex items-center justify-start flex-wrap w-full gap-2 overflow-x-scroll">
                {businessCategoryDropdownData
                  .filter((item: any) =>
                    categories.some((dept) => dept.value === item.value)
                  )
                  .map((item) => (
                    <div
                      className="flex items-center justify-between gap-x-2 rounded-full py-[8px] px-[8px] bg-grayscalBg border-2 border-borderColor w-fit"
                      key={item.value}
                    >
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
              "
              >
                Attachment
              </label>
              <div
                className="relative flex items-center justify-center text-sm 
                      border-dashed border-2 border-bgArmy rounded-[6px] w-full h-[121px]
                     "
              >
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
                      className="text-center font-normal text-base leading-[20px] flex items-center justify-center flex-col py-[1rem] text-primary px-2 gap-[.5rem] cursor-pointer "
                    >
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
              {errors.imageFile && (
                <p className="text-red-500 text-xs mt-1">{errors.imageFile}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Allowed file types: JPG, JPEG, PNG, PDF (max 3MB)
              </p>
            </div>

            <Button
              type="submit"
              primary
              className="w-full"
              isLoading={isLoading}
            >
              Continue
            </Button>
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
