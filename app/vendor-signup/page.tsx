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
import { safeLocalStorage, updateUserData } from "@/app/lib/utils";

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

      // Update user scope to include VENDOR after successful vendor creation
      const currentUserData = JSON.parse(
        safeLocalStorage.getItem("userDetails", '{"scope": []}')
      );

      const currentScope = currentUserData.scope || [];
      const updatedScope = currentScope.includes("VENDOR")
        ? currentScope
        : [...currentScope, "VENDOR"];

      const updatedUserData = {
        ...currentUserData,
        scope: updatedScope,
      };

      updateUserData("userDetails", updatedUserData);

      // Redirect to dashboard after showing success message (vendor account created means they should see vendor dashboard)
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
    router.push("/all");
  };

  return (
    <div className="flex h-screen w-full text-black">
      {/* Left side - Form section */}
      <div className="w-1/2 bg-white flex flex-col overflow-y-auto">
        <div className="flex justify-between p-6">
          <p className="font-bold text-2xl">Bringam</p>
          <button
            onClick={handleSwitchToCustomer}
            className="flex items-center justify-between bg-black text-white gap-3 p-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <RxExit />
            <p>Switch to customer</p>
          </button>
        </div>

        <div className="flex-grow flex items-center justify-center">
          <div className="w-[90%] max-w-[604px] p-4">
            <div className="mb-6">
              <h2 className="font-bold text-xl md:text-2xl">Become a vendor</h2>
              <p className="text-gray-500 text-xs md:text-sm mt-1">
                Basic vendor data is required to create a new vendor profile.
              </p>
            </div>

            <form onSubmit={onBecomeAVendor}>
              <Input
                label="Business name"
                type="text"
                name="businessName"
                id="businessName"
                value={businessName}
                onChange={handleInputChange}
                placeholder="Enter business name"
                className="border-gray-300 rounded w-full mb-5"
                error={errors.businessName}
              />

              <div className="mb-5">
                <h5 className="text-black3 text-sm md:text-base font-semibold mb-2">
                  Category
                </h5>
                <MultiSelectDropdown
                  options={businessCategoryDropdownData}
                  onSelect={handleSelect}
                  className="!w-full bg-white !rounded-lg border border-gray-300"
                  placeholder="Select a category"
                  existingSeleted={categories}
                />
                {errors.categories && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.categories}
                  </p>
                )}
              </div>

              {categories.length > 0 && (
                <div className="flex items-center justify-start flex-wrap w-full gap-2 mb-5">
                  {businessCategoryDropdownData
                    .filter((item: any) =>
                      categories.some((dept) => dept.value === item.value)
                    )
                    .map((item) => (
                      <div
                        className="flex items-center justify-between gap-x-2 rounded-full py-[8px] px-[8px] bg-grayscalBg border border-gray-200 w-fit"
                        key={item.value}
                      >
                        <h4 className="text-sm text-primary font-medium leading-[16px]">
                          {item.label}
                        </h4>
                      </div>
                    ))}
                </div>
              )}

              <div className="mb-5">
                <label className="text-black3 text-sm md:text-base font-semibold mb-2 block">
                  Business document
                </label>
                <div className="relative flex items-center justify-center text-sm border-dashed border-2 border-gray-400 rounded-lg w-full h-[121px]">
                  {fileName ? (
                    <>
                      <div className="absolute top-2 right-2 cursor-pointer">
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
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-md">
                      <label
                        htmlFor="file-input"
                        className="text-center font-normal text-base flex items-center justify-center flex-col py-[1rem] text-gray-700 px-2 gap-[.5rem] cursor-pointer"
                      >
                        <PiUploadSimpleBold className="text-[24px]" />
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.imageFile}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Allowed file types: JPG, JPEG, PNG, PDF (max 3MB)
                </p>
              </div>

              <Button
                type="submit"
                primary
                className="w-full mt-6"
                isLoading={isLoading}
              >
                Create account
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Image section with dark background */}
      <div className="w-1/2 bg-[#3A4744] text-white flex flex-col justify-center items-center">
        <Image
          src="/images/vendor.png"
          width={550}
          height={680}
          alt="Vendor"
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default VendorAuth;
