"use client";

import React, { useContext, useState, useEffect } from "react";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import Button from "../common/Button";
import OtpInput from "../common/OtpInput";
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

const SignupOTP = () => {
  const context = useContext(OnboardingContext);
  const [error, setError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(0);

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const {
    onOtp: contextOtp,
    onChange,
    state,
    onResendOtp: contextResendOtp,
  } = context;
  const { signupOTP, isLoading, email } = state;

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
        name: "signupOTP",
        value,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Validate the OTP
  const validateOtp = (): boolean => {
    if (!signupOTP) {
      setError("Please enter the verification code");
      return false;
    }

    if (signupOTP.length !== 6) {
      setError("Please enter all 6 digits of the verification code");
      return false;
    }

    if (!/^\d+$/.test(signupOTP)) {
      setError("Verification code should contain only digits");
      return false;
    }

    return true;
  };

  // Handle form submission
  const onOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOtp()) {
      showToast(error, "error");
      return;
    }

    contextOtp(e);
  };

  // Handle resend OTP with timer
  const onResendOtp = () => {
    if (resendTimer > 0) return;

    // Create a synthetic form event
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;

    try {
      contextResendOtp(syntheticEvent)
        .then((response: any) => {
          if (response && response.data && response.data.message) {
            showToast(response.data.message, "success");
          } else {
            showToast(
              "Verification code has been resent to your email",
              "success"
            );
          }
        })
        .catch((err: any) => {
          let errorMessage = "Failed to resend code. Please try again.";
          if (err.response && err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          }
          showToast(errorMessage, "error");
        });
    } catch (error: any) {
      let errorMessage = "Failed to resend code. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
    }

    setResendTimer(60); // 60 seconds countdown
  };

  // Countdown timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [resendTimer]);

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
        <p className="font-bold text-xl md:text-2xl">Account Verification</p>
        <p className="font-semibold text-[#979797] text-xs md:text-sm mt-1">
          A verification code has been sent to{" "}
          <span className="font-bold text-black">
            {formatMaskedEmail(email)}
          </span>
        </p>
      </div>
      <form onSubmit={onOtp} className="mt-4 md:mt-8">
        <OtpInput
          label="Enter verification code"
          value={signupOTP}
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
            Verify Account
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-textGray2">
            Didn&apos;t receive code?{" "}
            <button
              type="button"
              onClick={onResendOtp}
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

export default SignupOTP;
