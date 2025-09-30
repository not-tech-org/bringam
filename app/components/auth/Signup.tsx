"use client";

import React, { useContext, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import Toastify from "toastify-js";
import { motion } from "framer-motion";

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

// Animation variants for subtle form interactions
const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0
  }
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

const linkVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.15
    }
  }
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
    <motion.div 
      className="rounded-3xl border-2 border-[#EDEDED] p-6 md:p-8 lg:p-10 bg-[#FCFCFC] w-[95%] max-w-[650px] max-h-[90vh] overflow-y-auto"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ type: "spring", duration: 0.5 }}
    >
      <motion.div 
        className="text-center mb-4"
        variants={itemVariants}
      >
        <p className="font-bold text-xl md:text-2xl">Create account</p>
        <p className="font-semibold text-[#979797] text-xs md:text-sm mt-1">
          Get started by creating an account
        </p>
      </motion.div>
      <motion.form 
        onSubmit={onSignUp} 
        className="w-full space-y-4"
        variants={itemVariants}
      >
        {/* Name fields in a row on larger screens */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={itemVariants}
        >
          <Input
            label="First Name"
            type="text"
            name="firstName"
            id="firstName"
            value={firstName}
            onChange={handleInputChange}
            placeholder="Enter first name"
            className="border-gray-300 rounded w-100"
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
            className="border-gray-300 rounded w-100"
            error={errors.lastName}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleInputChange}
            placeholder="abc@gmail.com"
            className="border-gray-300 rounded w-100"
            error={errors.email}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handleInputChange}
            placeholder="**************"
            className="border-gray-300 rounded w-100"
            error={errors.password}
            helperText="8+ chars with uppercase, lowercase & numbers"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={handleInputChange}
            placeholder="**************"
            className="border-gray-300 rounded w-100"
            error={errors.confirmPassword}
          />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button type="submit" primary className="w-full" isLoading={isLoading}>
            Create account
          </Button>
        </motion.div>

        <motion.div 
          className="text-center mt-4"
          variants={itemVariants}
        >
          <p className="text-textGray2">
            Already have an account?{" "}
            <motion.span
              className="text-bgArmy cursor-pointer font-medium"
              onClick={() => onRouteChange("signin")}
              variants={linkVariants}
              whileHover="hover"
            >
              Sign in
            </motion.span>
          </p>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default Signup;
