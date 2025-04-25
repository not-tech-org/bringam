"use client";

import React, { useContext, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import Toastify from "toastify-js";

// Toast configuration constants - matching the signin component
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

const Signup = () => {
  const context = useContext(OnboardingContext);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const { onRouteChange, onChange, state, onSignUp: contextSignUp } = context;
  const { firstName, lastName, email, password, confirmPassword, isLoading } =
    state;

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

  // Email validation regex
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    // Name validations
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!validatePasswordStrength(password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase and numbers";
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission with validation
  const onSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Show only one error message to avoid overwhelming the user
      const errorKey = Object.keys(errors)[0] as keyof typeof errors;
      if (errorKey && errors[errorKey]) {
        showToast(errors[errorKey]!, "error");
      }
      return;
    }

    // If validation passes, proceed with signup
    contextSignUp(e);
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

  return (
    <div
      className="rounded-3xl border-2 border-[#EDEDED] p-14 bg-[#FCFCFC]"
      style={{ width: 604 }}
    >
      <div className="text-center">
        <p className="font-bold text-2xl">Create account</p>
        <p className="font-semibold text-[#979797] text-sm mt-1">
          Get started by creating an account
        </p>
      </div>
      <form onSubmit={onSignUp} className="w-full mt-6">
        <Input
          label="First Name"
          type="text"
          name="firstName"
          id="firstName"
          value={firstName}
          onChange={handleInputChange}
          placeholder="Enter first name"
          className="border-gray-300 rounded w-100 mb-3"
          error={errors.firstName}
        />
        <Input
          label="Last Name"
          type="text"
          name="lastName"
          id="lastName"
          value={lastName}
          onChange={handleInputChange}
          placeholder="Enter last name"
          className="border-gray-300 rounded w-100 mb-3"
          error={errors.lastName}
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleInputChange}
          placeholder="abc@gmail.com"
          className="border-gray-300 rounded w-100 mb-3"
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleInputChange}
          placeholder="**************"
          className="border-gray-300 rounded w-100 mb-3"
          error={errors.password}
          helperText="Password must be at least 8 characters with uppercase, lowercase and numbers"
        />
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleInputChange}
          placeholder="**************"
          className="border-gray-300 rounded w-100 mb-3"
          error={errors.confirmPassword}
        />

        <Button type="submit" primary className="w-full" isLoading={isLoading}>
          Create account
        </Button>

        <div className="text-center mt-4">
          <p className="text-textGray2">
            Already have an account?{" "}
            <span
              className="text-bgArmy cursor-pointer font-medium"
              onClick={() => onRouteChange("signin")}
            >
              Sign in
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
