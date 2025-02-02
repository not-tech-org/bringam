import axios from "axios";
import React, {
  createContext,
  useState,
  ChangeEvent,
  ReactNode,
  ChangeEventHandler,
} from "react";
import { signupUrl } from "@/plugins/url";
import {
  forgotPasswordApi,
  otpApi,
  resendOtpApi,
  signinApi,
  signupApi,
} from "../services/AuthService";
import { toast } from "react-toastify";
import { validatePassword } from "../components/utils/helperFunctions";

interface OnboardingContextType {
  onSignUp: (e: React.FormEvent) => any;
  onSignIn: (e: React.FormEvent) => any;
  onOtp: (e: React.FormEvent) => any;
  onResendOtp: (e: React.FormEvent) => any;
  onForgetPassword: (e: React.FormEvent) => any;
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
  route: string;
}

export const OnboardingContext = createContext<
  OnboardingContextType | undefined
>(undefined);
export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StateType>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    route: "",
    signupOTP: "",
    forgotPasswordOTP: "",
  });

  const { firstName, lastName, email, password, confirmPassword, signupOTP } =
    state;

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

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(password);

    const formApiData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      registrationChannel: "WEB",
    };

    if (password.length !== 8) {
      return toast.error("Enter a valid password with at least 8 characters", {
        position: "top-right",
        theme: "colored",
      });
    }

    if (password !== confirmPassword) {
      return toast.error("Please confirm password", {
        position: "top-right",
        theme: "colored",
      });
    }

    if (!validatePassword(password)) {
      return toast.error(
        "Password should include 1 capital, 1 small, and 1 special character",
        {
          position: "top-right",
          theme: "colored",
        }
      );
    }

    try {
      const res = await signupApi(formApiData);

      if (res.data.success) {
        const uuid = res.data.data;

        // Save UUID to localStorage
        localStorage.setItem("signupUUID", uuid);

        onRouteChange("SignupOTP");
        toast.success("Signup successful! Proceed to OTP verification.", {
          position: "top-right",
          theme: "colored",
        });
      } else {
        toast.error("Signup failed. Please try again.", {
          position: "top-right",
          theme: "colored",
        });
      }
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.message || "An error occurred", {
          position: "top-right",
          theme: "colored",
        });
        console.log(err.response);
      } else {
        toast.error("Network error or timeout", {
          position: "top-right",
          theme: "colored",
        });
        console.log(err);
      }
    }
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(password);

    const formApiData = {
      username: email,
      password,
    };

    if (!email) {
      return toast.error("Email cannot be empty", {
        position: "top-right",
        theme: "colored",
      });
    }

    if (!password) {
      return toast.error("Password cannot be empty", {
        position: "top-right",
        theme: "colored",
      });
    }

    try {
      const res = await signinApi(formApiData);

      localStorage.setItem("accessTokenBringAm", res.data.data.access_token);

      // onRouteChange("SignupOTP");
      toast.success(res.data.message, {
        position: "top-right",
        theme: "colored",
      });
    } catch (err: any) {
      console.log(err);

      if (err.response) {
        toast.error(err.response.data.message || "An error occurred", {
          position: "top-right",
          theme: "colored",
        });
      } else {
        toast.error("Network error or timeout", {
          position: "top-right",
          theme: "colored",
        });
        console.log(err);
      }
    }
  };

  const onOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupOTP) {
      return toast.error("Please input OTP", {
        position: "top-right",
        theme: "colored",
      });
    }

    try {
      const res = await otpApi(signupOTP);
      console.log(res.data);
      onRouteChange("signin");
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.message || "An error occurred");
        console.log(err.response);
      } else {
        toast("Network error or timeout");
        console.log(err);
      }
    }
  };

  const onResendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const uuid = localStorage.getItem("signupUUID");

    if (!uuid) {
      return toast.error("Please UUID cannot be empty", {
        position: "top-right",
        theme: "colored",
      });
    }

    try {
      const res = await resendOtpApi(uuid);
      toast.success(res.data.message, {
        position: "top-right",
        theme: "colored",
      });
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.message || "An error occurred");
        console.log(err.response);
      } else {
        toast("Network error or timeout");
        console.log(err);
      }
    }
  };

  const onForgetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email cannot be empty", {
        position: "top-right",
        theme: "colored",
      });
    }

    try {
      const res = await forgotPasswordApi(email);
      toast.success(res.data.message, {
        position: "top-right",
        theme: "colored",
      });
    } catch (err: any) {
      if (err.response) {
        toast.error(err.response.data.message || "An error occurred");
        console.log(err.response);
      } else {
        toast("Network error or timeout");
        console.log(err);
      }
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        onForgetPassword,
        onOtp,
        onSignIn,
        onSignUp,
        onResendOtp,
        onChange,
        onRouteChange,
        state,
      }}>
      {children}
    </OnboardingContext.Provider>
  );
};
