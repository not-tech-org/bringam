"use client";

import React, { createContext, useState, ChangeEvent, ReactNode } from "react";
import {
  forgotPasswordApi,
  forgotPasswordOtpVerifyApi,
  resetPasswordApi,
  logoutApi,
  otpApi,
  resendOtpApi,
  signupApi,
} from "../services/AuthService";
import { toast } from "react-toastify";
import {
  showToast,
  validateEmail,
  validatePassword,
} from "../components/utils/helperFunctions";
import { safeLocalStorage } from "@/app/lib/utils";

interface OnboardingContextType {
  onSignUp: (e: React.FormEvent) => Promise<any>;
  onOtp: (e: React.FormEvent) => Promise<any>;
  onResendOtp: (e: React.FormEvent) => Promise<any>;
  onForgetPassword: (e: React.FormEvent) => Promise<any>;
  onForgetPasswordOtpVerify: (e: React.FormEvent) => Promise<any>;
  onResetPassword: (e: React.FormEvent) => Promise<any>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRouteChange: (value: string) => void;
  state: StateType;
}

interface StateType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  signupOTP: string;
  forgotPasswordOTP: string;
  newPassword: string;
  confirmNewPassword: string;
  isLoading: boolean;
  route: string;
}

// Default context value
const defaultContextValue: OnboardingContextType = {
  onSignUp: () => Promise.resolve(),
  onOtp: () => Promise.resolve(),
  onResendOtp: () => Promise.resolve(),
  onForgetPassword: () => Promise.resolve(),
  onForgetPasswordOtpVerify: () => Promise.resolve(),
  onResetPassword: () => Promise.resolve(),
  onChange: () => {},
  onRouteChange: () => {},
  state: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    signupOTP: "",
    forgotPasswordOTP: "",
    newPassword: "",
    confirmNewPassword: "",
    isLoading: false,
    route: "signin",
  },
};

export const OnboardingContext =
  createContext<OnboardingContextType>(defaultContextValue);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StateType>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    route: "signin",
    signupOTP: "",
    forgotPasswordOTP: "",
    newPassword: "",
    confirmNewPassword: "",
    isLoading: false,
  });

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    signupOTP,
    forgotPasswordOTP,
    newPassword,
    confirmNewPassword,
  } = state;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onRouteChange = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      route: value,
    }));
  };

  const onSignUp = async (e: React.FormEvent): Promise<any> => {
    e.preventDefault();

    const formApiData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      registrationChannel: "WEB",
    };

    if (!firstName) {
      return Promise.reject(new Error("First name cannot be empty"));
    }

    if (!lastName) {
      return Promise.reject(new Error("Last name cannot be empty"));
    }

    if (!validateEmail(email)) {
      return Promise.reject(new Error("Please enter a valid email"));
    }

    if (password !== confirmPassword) {
      return Promise.reject(new Error("Please confirm password"));
    }

    if (!validatePassword(password)) {
      return Promise.reject(
        new Error(
          "Password should include 1 capital, 1 small, and 1 special character"
        )
      );
    }

    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    try {
      const res = await signupApi(formApiData);

      if (res.data.success) {
        const uuid = res.data.data;

        // Save UUID to localStorage
        safeLocalStorage.setItem("signupUUID", uuid);

        onRouteChange("SignupOTP");
      }

      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      return res;
    } catch (err: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      return Promise.reject(err);
    }
  };

  const onOtp = async (e: React.FormEvent): Promise<any> => {
    e.preventDefault();

    if (!signupOTP) {
      return Promise.reject(new Error("Please input OTP"));
    }

    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    try {
      const res = await otpApi(signupOTP);

      onRouteChange("signin");

      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      return res;
    } catch (err: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      return Promise.reject(err);
    }
  };

  const onResendOtp = async (e: React.FormEvent): Promise<any> => {
    e.preventDefault();

    const uuid = safeLocalStorage.getItem("signupUUID");

    if (!uuid) {
      return Promise.reject(new Error("UUID cannot be empty"));
    }

    try {
      const res = await resendOtpApi(uuid);
      return res;
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  const onForgetPassword = async (e: React.FormEvent): Promise<any> => {
    e.preventDefault();

    if (!email) {
      return Promise.reject(new Error("Email cannot be empty"));
    }

    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    try {
      const res = await forgotPasswordApi(email);

      // Navigate to OTP verification on success
      onRouteChange("forgotPasswordOTP");

      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      return res;
    } catch (err: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      return Promise.reject(err);
    }
  };

  const onForgetPasswordOtpVerify = async (
    e: React.FormEvent
  ): Promise<any> => {
    e.preventDefault();

    if (!forgotPasswordOTP) {
      return Promise.reject(new Error("OTP cannot be empty"));
    }

    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    try {
      const res = await forgotPasswordOtpVerifyApi(forgotPasswordOTP);

      // Navigate to reset password on success
      onRouteChange("resetPassword");

      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      return res;
    } catch (err: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      return Promise.reject(err);
    }
  };

  const onResetPassword = async (e: React.FormEvent): Promise<any> => {
    e.preventDefault();

    if (!forgotPasswordOTP) {
      return Promise.reject(new Error("OTP is required. Please verify your code first."));
    }

    if (!newPassword || !confirmNewPassword) {
      return Promise.reject(new Error("Password fields cannot be empty"));
    }

    if (newPassword !== confirmNewPassword) {
      return Promise.reject(new Error("Passwords do not match"));
    }

    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    try {
      const res = await resetPasswordApi({
        otp: forgotPasswordOTP,
        password: newPassword,
        confirmPassword: confirmNewPassword,
      });

      // Navigate to signin on success
      setTimeout(() => {
        onRouteChange("signin");
      }, 2000);

      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      return res;
    } catch (err: any) {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));

      return Promise.reject(err);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        onForgetPassword,
        onForgetPasswordOtpVerify,
        onResetPassword,
        onOtp,
        onSignUp,
        onResendOtp,
        onChange,
        onRouteChange,
        state,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
