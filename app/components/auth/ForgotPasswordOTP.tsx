"use client";

import React, { useContext, useState, useEffect } from "react";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import Button from "../common/Button";
import OtpInput from "../common/OtpInput";
import Toastify from "toastify-js";
import { getServerMessage } from "@/app/lib/apiFeedback";

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

// Separate component to ensure hooks are called unconditionally
const ForgotPasswordOTPContent = ({ context }: { context: any }) => {
  const [error, setError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendTimer]);

  const {
    onRouteChange,
    onChange,
    state,
    onResendForgotPassword,
  } = context;
  const { forgotPasswordOTP, email, isLoading } = state;

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

  // Handle OTP change
  const handleOtpChange = (value: string) => {
    // Clear error when user types
    if (error) setError("");

    // Update the context state
    onChange({
      target: {
        name: "forgotPasswordOTP",
        value,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Validate the OTP
  const validateOtp = (): string | null => {
    if (!forgotPasswordOTP) {
      return "Please enter the verification code";
    }

    if (forgotPasswordOTP.length !== 6) {
      return "Please enter all 6 digits of the verification code";
    }

    if (!/^\d+$/.test(forgotPasswordOTP)) {
      return "Verification code should contain only digits";
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateOtp();
    if (validationError) {
      setError(validationError);
      showToast(validationError, "error");
      return;
    }

    onRouteChange("resetPassword");
  };

  // Handle resend OTP with timer
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    try {
      const response = await onResendForgotPassword();
      showToast(
        getServerMessage(
          response,
          "Verification code has been resent to your email"
        ),
        "success"
      );
      setResendTimer(60);
    } catch (error: any) {
      showToast(
        getServerMessage(error, "Failed to resend code. Please try again."),
        "error"
      );
    }
  };

  // Format masked email for display
  const formatMaskedEmail = (email: string = "") => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    if (!username || !domain) return email;

    const maskedUsername =
      username.charAt(0) +
      "*".repeat(Math.max(1, username.length - 2)) +
      (username.length > 1 ? username.charAt(username.length - 1) : "");

    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className="rounded-3xl border-2 border-[#EDEDED] p-8 md:p-14 bg-[#FCFCFC] w-[90%] max-w-[604px]">
      <div className="text-center">
        <p className="font-bold text-xl md:text-2xl">Reset Password</p>
        <p className="font-semibold text-[#979797] text-xs md:text-sm mt-1">
          A verification code has been sent to{" "}
          <span className="font-bold text-black">
            {formatMaskedEmail(email)}
          </span>
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 md:mt-8">
        <OtpInput
          label="Enter verification code"
          value={forgotPasswordOTP}
          onChange={handleOtpChange}
          error={error}
          autoFocus
        />

        <div className="mt-6">
          <Button
            type="submit"
            primary
            className="w-full"
            isLoading={isLoading}
          >
            Continue
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-textGray2">
            Didn&apos;t receive code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0}
              className={`text-bgArmy font-medium cursor-pointer ${
                resendTimer > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

// Main component that conditionally renders content
const ForgotPasswordOTP = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  return <ForgotPasswordOTPContent context={context} />;
};

export default ForgotPasswordOTP;
