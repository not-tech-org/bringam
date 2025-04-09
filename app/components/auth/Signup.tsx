"use client";

import React, { useContext, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";

const Signup = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }
  //qwertQ1@
  const { onRouteChange, onChange, state, onSignUp } = context;

  const { firstName, lastName, email, password, confirmPassword, isLoading } =
    state;

  return (
    <div
      className="rounded-3xl border-2 border-[#EDEDED] p-14 bg-[#FCFCFC]"
      style={{ width: 604 }}>
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
          onChange={onChange}
          placeholder="Enter first name"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Input
          label="Last Name"
          type="text"
          name="lastName"
          id="lastName"
          value={lastName}
          onChange={onChange}
          placeholder="Enter last name"
          className="border-gray-300 rounded w-100 mb-3"
        />
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
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          placeholder="**************"
          className="border-gray-300 rounded w-100 mb-3"
        />
        {isLoading === true ? (
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
          <Button type="submit" primary>
            Create account
          </Button>
        )}

        <div className="text-center">
          <p className="text-textGray2">
            Already have an account?{" "}
            <span className="text-bgArmy">
              <span
                className="cursor-pointer"
                onClick={() => onRouteChange("signin")}>
                Sign in
              </span>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
