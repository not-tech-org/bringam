"use client";

import React, { useContext, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import Toastify from "toastify-js";
import { motion } from "framer-motion";
import { getServerMessage } from "@/app/lib/apiFeedback";

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
    return { isValid, errors: newErrors };
  };

  // Handle form submission with validation
  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateForm();
    if (!validation.isValid) {
      // Show only one error message to avoid overwhelming the user
      const errorKey = Object.keys(validation.errors)[0] as keyof typeof validation.errors;
      if (errorKey && validation.errors[errorKey]) {
        showToast(validation.errors[errorKey]!, "error");
      }
      return;
    }

    try {
      const response = await contextSignUp(e);
      showToast(response?.data?.message || "Account created successfully", "success");
    } catch (error) {
      showToast(getServerMessage(error, "Unable to create your account"), "error");
    }
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
      className="w-full max-w-[650px]"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ type: "spring", duration: 0.5 }}
    >
      <motion.div variants={itemVariants}>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#586a65]">
          Customer account
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
          Join Bringam to discover local stores and manage your orders.
        </p>
      </motion.div>
      <motion.form
        onSubmit={onSignUp}
        className="mt-8 w-full space-y-5"
        variants={itemVariants}
        noValidate
      >
        {/* Name fields in a row on larger screens */}
        <motion.div 
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
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
            className="w-full rounded-lg border border-gray-300 bg-white transition-colors focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
            error={errors.firstName}
            required
            autoComplete="given-name"
          />
          <Input
            label="Last Name"
            type="text"
            name="lastName"
            id="lastName"
            value={lastName}
            onChange={handleInputChange}
            placeholder="Enter last name"
            className="w-full rounded-lg border border-gray-300 bg-white transition-colors focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
            error={errors.lastName}
            required
            autoComplete="family-name"
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
            placeholder="you@example.com"
            className="w-full rounded-lg border border-gray-300 bg-white transition-colors focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
            error={errors.email}
            required
            autoComplete="email"
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
            className="w-full rounded-lg border border-gray-300 bg-white transition-colors focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
            error={errors.password}
            helperText="8+ chars with uppercase, lowercase & numbers"
            required
            autoComplete="new-password"
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
            className="w-full rounded-lg border border-gray-300 bg-white transition-colors focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            primary
            className="!my-2 min-h-12 w-full rounded-lg text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Create account
          </Button>
        </motion.div>

        <motion.div className="mt-5 text-center" variants={itemVariants}>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <motion.button
              type="button"
              className="font-semibold text-bgArmy hover:underline focus:outline-none focus:ring-2 focus:ring-bgArmy focus:ring-offset-2"
              onClick={() => onRouteChange("signin")}
              variants={linkVariants}
              whileHover="hover"
            >
              Sign in
            </motion.button>
          </p>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default Signup;
