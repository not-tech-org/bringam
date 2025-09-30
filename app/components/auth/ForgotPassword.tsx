"use client";

import React, { useContext, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { FaChevronLeft } from "react-icons/fa";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import Toastify from "toastify-js";
import { motion } from "framer-motion";

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

// Animation variants for subtle form interactions
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
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

const ForgotPassword = () => {
  const context = useContext(OnboardingContext);
  const [error, setError] = useState<string>("");

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const { onRouteChange, onChange, state, onForgetPassword } = context;
  const { email, isLoading } = state;

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

  // Email validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate form inputs
  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  // Handle input change and clear related error
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear error when user types
    if (error) setError("");
    onChange(e);
  };

  // Handle form submission with validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast(error, "error");
      return;
    }

    try {
      await onForgetPassword(e)
        .then((response: any) => {
          if (response && response.data && response.data.message) {
            showToast(response.data.message, "success");
          } else {
            showToast(
              "Password reset code has been sent to your email",
              "success"
            );
          }
          // Navigate to OTP verification
          onRouteChange("forgotPasswordOTP");
        })
        .catch((err: any) => {
          let errorMessage =
            "Failed to send password reset code. Please try again.";
          if (err.response && err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          }
          showToast(errorMessage, "error");
        });
    } catch (error: any) {
      let errorMessage =
        "Failed to send password reset code. Please try again.";
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
    <motion.div 
      className="rounded-3xl border-2 border-[#EDEDED] p-8 md:p-14 bg-[#FCFCFC] w-[90%] max-w-[604px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-center"
        variants={itemVariants}
      >
        <p className="font-bold text-xl md:text-2xl">Forgot Password</p>
        <p className="font-semibold text-[#979797] text-xs md:text-sm mt-1">
          Enter your email address to receive a password reset code
        </p>
      </motion.div>
      <motion.form 
        className="w-full mt-4 md:mt-6" 
        onSubmit={handleSubmit}
        variants={itemVariants}
      >
        <motion.div variants={itemVariants}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="abc@gmail.com"
            className="border-gray-300 rounded w-100 mb-3"
            error={error}
          />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button type="submit" primary className="w-full" isLoading={isLoading}>
            Send reset code
          </Button>
        </motion.div>

        <motion.div 
          className="flex justify-between items-center mt-4"
          variants={itemVariants}
        >
          <motion.div
            className="flex items-center gap-2 cursor-pointer transition-colors hover:text-bgArmy"
            onClick={() => onRouteChange("signin")}
            variants={linkVariants}
            whileHover="hover"
          >
            <FaChevronLeft className="text-sm" />
            <p className="text-textGray2 hover:text-bgArmy">Back to sign in</p>
          </motion.div>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default ForgotPassword;
