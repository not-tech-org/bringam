"use client";

import React, { useState, useContext } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import Toastify from "toastify-js";

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

const ResetPassword = () => {
  const context = useContext(OnboardingContext);
  const [errors, setErrors] = useState<{
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const { onRouteChange, onChange, state, onResetPassword } = context;
  const { newPassword, confirmNewPassword, isLoading } = state;

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

  // Password strength validation
  const validatePasswordStrength = (password: string) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors: {
      newPassword?: string;
      confirmNewPassword?: string;
    } = {};
    let isValid = true;

    // Password validation
    if (!newPassword) {
      newErrors.newPassword = "Password is required";
      isValid = false;
    } else if (!validatePasswordStrength(newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters with uppercase, lowercase and numbers";
      isValid = false;
    }

    // Confirm password validation
    if (!confirmNewPassword) {
      newErrors.confirmNewPassword = "Please confirm your password";
      isValid = false;
    } else if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle input change and clear related error
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    // Clear the error for this field when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
    onChange(e);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Show only one error message to avoid overwhelming the user
      const errorKey = Object.keys(errors)[0] as keyof typeof errors;
      if (errorKey && errors[errorKey]) {
        showToast(errors[errorKey]!, "error");
      }
      return;
    }

    try {
      if (onResetPassword) {
        const response = await onResetPassword(e);
        if (response && response.data && response.data.message) {
          showToast(response.data.message, "success");
        } else {
          showToast("Your password has been reset successfully", "success");
        }

        // Redirect to signin after successful password reset
        setTimeout(() => {
          onRouteChange("signin");
        }, 2000);
      }
    } catch (error: any) {
      let errorMessage = "Failed to reset password. Please try again later.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
    }
  };

  return (
    <div
      className="rounded-3xl border-2 border-[#EDEDED] p-14 bg-[#FCFCFC]"
      style={{ width: 604 }}
    >
      <div className="text-center">
        <p className="font-bold text-2xl">Create a new password</p>
        <p className="font-semibold text-[#979797] text-sm mt-1">
          Your new password must be different from previously used passwords
        </p>
      </div>
      <form className="w-full mt-6" onSubmit={handleSubmit}>
        <Input
          label="New Password"
          type="password"
          name="newPassword"
          id="newPassword"
          value={newPassword || ""}
          onChange={handleInputChange}
          placeholder="************"
          className="border-gray-300 rounded w-100 mb-3"
          error={errors.newPassword}
          helperText="Password must be at least 8 characters with uppercase, lowercase and numbers"
        />
        <Input
          label="Confirm New Password"
          type="password"
          name="confirmNewPassword"
          id="confirmNewPassword"
          value={confirmNewPassword || ""}
          onChange={handleInputChange}
          placeholder="************"
          className="border-gray-300 rounded w-100 mb-3"
          error={errors.confirmNewPassword}
        />
        <Button type="submit" primary className="w-full" isLoading={isLoading}>
          Reset password
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
