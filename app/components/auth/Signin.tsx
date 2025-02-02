import React, { useContext } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Link from "next/link";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";

const Signin = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const { onRouteChange, onChange, state, onSignIn } = context;

  const { email, password } = state;

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
        <Button type="submit" primary>
          Sign in
        </Button>
        <div className="text-center">
          <p className="text-textGray2">
            Don't have an account?{" "}
            <span
              className="text-bgArmy cursor-pointer"
              onClick={() => onRouteChange("signup")}
            >
              Sign up
            </span>
          </p>
          <div className="">
            <p
              className="cursor-pointer text-textGray2 hover:text-bgArmy"
              onClick={() => onRouteChange("forgotPassword")}
            >
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
