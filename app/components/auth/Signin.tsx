"use client";

import React, { useContext, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Cookies from "js-cookie";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import { signinApi } from "@/app/services/AuthService";
import { useRouter } from "next/navigation";
import { showToast, validateEmail } from "../utils/helperFunctions";
import Toastify from "toastify-js";

const Signin = () => {
  const context = useContext(OnboardingContext);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const { onRouteChange, onChange, state } = context;

  const { email, password } = state;

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const formApiData = {
      username: email,
      password,
    };

    if (!validateEmail(email)) {
      // return showToast("Please enter a valid email", "error");
      return Toastify({
        text: `Please enter a valid email`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#e89191",
        stopOnFocus: true,
      }).showToast();
    }

    if (!password) {
      // return showToast("Password cannot be empty", "error");
      return Toastify({
        text: `Password cannot be empty`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#e89191",
        stopOnFocus: true,
      }).showToast();
    }

    setIsLoading(true);
    try {
      const res = await signinApi(formApiData);

      Cookies.set("bringAmToken", res.data.data.access_token, {
        expires: undefined,
      });

      // showToast(res.data.message, "success", "top-center");
      Toastify({
        text: `${res.data.message}`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#e89191",
        stopOnFocus: true,
      }).showToast();
      
      router.push("/dashboard");
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);

      if (err.response) {
        showToast(err.response.data.message || "An error occurred", "error");
      } else {
        showToast("Network error or timeout", "error");
      }
    }
  };

  return (
    <div
      className="rounded-3xl border-2 border-[#EDEDED] p-14 bg-[#FCFCFC]"
      style={{ width: 604 }}>
      <div className="text-center">
        <p className="font-bold text-2xl">Sign in</p>
        <p className="font-semibold text-[#979797] text-sm mt-1">
          Sign in to your account
        </p>
      </div>
      <form className="w-full mt-6" onSubmit={onSignIn}>
        <Input
          label="Email Address"
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={onChange}
          placeholder="abc@gmail.com"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={onChange}
          placeholder="**************"
          className="border-gray-300 rounded w-100 mb-3"
        />
        {isLoading ? (
          <Button type="button" primary className="" disabled>
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </Button>
        ) : (
          <Button type="submit" primary className="w-full">
            Sign in
          </Button>
        )}

        <div className="text-center">
          <p className="text-textGray2">
            {"Don't"} have an account?{" "}
            <span
              className="text-bgArmy cursor-pointer"
              onClick={() => onRouteChange("signup")}>
              Sign up
            </span>
          </p>
          <div className="">
            <p
              className="cursor-pointer text-textGray2 hover:text-bgArmy"
              onClick={() => onRouteChange("forgotPassword")}>
              Forgot password?{" "}
              {/* <span className="text-bgArmy">
                <span
                  className="cursor-pointer"
                  onClick={() => onRouteChange("forgotPassword")}
                >
                  Click here
                </span>
              </span> */}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Signin;
