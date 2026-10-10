"use client";

import React, { useState } from "react";
import { RxExit } from "react-icons/rx";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { becomeVendorApi } from "../services/AuthService";
import { businessCategoryDropdownData } from "../components/common/BringAmData";
import MultiSelectDropdown from "../components/common/MultiSelectDropdown";
import TruncatedText from "../components/common/TruncatedText";
import { PiUploadSimpleBold } from "react-icons/pi";
import { TiTimes } from "react-icons/ti";
import { useRouter } from "next/navigation";
import Toastify from "toastify-js";
import { safeLocalStorage, updateUserData } from "@/app/lib/utils";
import AuthBrand from "../components/auth/AuthBrand";
import AuthVisualPanel from "../components/auth/AuthVisualPanel";

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
    return { isValid, newErrors };
  };

  const onBecomeAVendor = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, newErrors } = validateForm();

    if (!isValid) {
      // Show only one error message to avoid overwhelming the user
      const errorKey = Object.keys(newErrors)[0] as keyof typeof newErrors;
      if (errorKey && newErrors[errorKey]) {
        showToast(newErrors[errorKey]!, "error");
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
    <main className="h-[100vh] min-h-[100vh] max-h-[100vh] w-[100vw] min-w-[100vw] max-w-[100vw] overflow-hidden bg-white text-black lg:grid lg:grid-cols-[2fr_3fr]">
      <AuthVisualPanel
        imageSrc="/images/vendor-signup.png"
        imageAlt="A vendor preparing a customer order in her store"
        eyebrow="Sell with Bringam"
        title="Turn your products into a growing online business."
        description="Set up your profile, list your products, and manage customer orders from one place."
      />

      <section className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-8 lg:border-b-0 lg:px-12 lg:py-7">
          <AuthBrand />
          <button
            type="button"
            onClick={handleSwitchToCustomer}
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 sm:px-4"
          >
            <RxExit aria-hidden="true" />
            <span className="hidden sm:inline">Switch to customer</span>
            <span className="sm:hidden">Customer view</span>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-5 py-10 sm:px-8 lg:px-12 lg:py-8">
            <div className="w-full max-w-[620px]">
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#586a65]">
                Vendor onboarding
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Create your vendor profile
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
                Tell us about your business so you can start listing products
                and managing orders on Bringam.
              </p>
            </div>

            <form onSubmit={onBecomeAVendor} noValidate>
              <Input
                label="Business name"
                type="text"
                name="businessName"
                id="businessName"
                value={businessName}
                onChange={handleInputChange}
                placeholder="Enter business name"
                className="mb-6 w-full rounded-lg border border-gray-300 bg-white transition-colors focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
                error={errors.businessName}
                required
                autoComplete="organization"
              />

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-900 sm:text-base">
                  Business categories
                </label>
                <MultiSelectDropdown
                  options={businessCategoryDropdownData}
                  onSelect={handleSelect}
                  className="!h-16 !w-full !rounded-lg border border-gray-300 bg-white !px-6 transition-colors hover:border-gray-500"
                  placeholder={
                    categories.length > 0
                      ? `${categories.length} categor${
                          categories.length === 1 ? "y" : "ies"
                        } selected`
                      : "Select business categories"
                  }
                  existingSeleted={categories}
                />
                {errors.categories && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.categories}
                  </p>
                )}
              </div>

              {categories.length > 0 && (
                <div className="mb-6 flex w-full flex-wrap items-center justify-start gap-2">
                  {businessCategoryDropdownData
                    .filter((item: any) =>
                      categories.some((dept) => dept.value === item.value)
                    )
                    .map((item) => (
                      <div
                        className="flex w-fit items-center justify-between gap-x-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2"
                        key={item.value}
                      >
                        <h4 className="text-sm text-primary font-medium leading-[16px]">
                          {item.label}
                        </h4>
                      </div>
                    ))}
                </div>
              )}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-900 sm:text-base">
                  Business document
                </label>
                <div
                  className={`relative flex min-h-[132px] w-full items-center justify-center rounded-xl border-2 border-dashed text-sm transition-colors ${
                    errors.imageFile
                      ? "border-red-400 bg-red-50/40"
                      : "border-gray-300 bg-gray-50/70 hover:border-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {fileName ? (
                    <>
                      <button
                        type="button"
                        aria-label="Remove uploaded business document"
                        onClick={handleRemoveFile}
                        className="absolute right-3 top-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <TiTimes
                          aria-hidden="true"
                          className="rounded-full bg-red-500 p-1 text-[24px] text-white"
                        />
                      </button>

                      <div className="px-12 text-center">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Document attached
                        </p>
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
                        className="flex cursor-pointer flex-col items-center justify-center gap-2 px-4 py-4 text-center text-base font-semibold text-gray-800 focus-within:outline-none"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
                          <PiUploadSimpleBold
                            aria-hidden="true"
                            className="text-[22px]"
                          />
                        </span>
                        Upload business document
                        <span className="text-xs font-normal text-gray-500">
                          JPG, JPEG, PNG or PDF, up to 3MB
                        </span>
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
              </div>

              <Button
                type="submit"
                primary
                className="!my-0 min-h-12 w-full rounded-lg text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Create vendor account
              </Button>
            </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default VendorAuth;
