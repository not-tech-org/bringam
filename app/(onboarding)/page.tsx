"use client";

import Image from "next/image";
import AppLayout from "../components/AppLayout";
import Header from "../components/Header";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Link from "next/link";
import Signup from "../components/auth/Signup";
import Signin from "../components/auth/Signin";
import ForgotPassword from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";

export default function Onboarding() {
  const authStep = [
    {
      asset: "/icons/account.svg",
      title: "Create an account",
      description:
        "Find vendors near you and get access to a wide range of products with ease. Sign up now to discover local businesses, compare prices, and shop confidently—all in one place.",
    },
    {
      asset: "",
      title: "Welcome back",
      description:
        "Signin to your account to continue shopping. locate venors and find the best deals around you",
    },
    {
      asset: "",
      title: "Forgot password?",
      description:
        "Easy! Just enter your Email address and get the password reset code sent to you in seconds!",
    },
    {
      asset: "",
      title: "Reset password?",
      description:
        "Good, now enter the password reset code that was sent to your Email address.",
    },
    {
      asset: "",
      title: "New password?",
      description:
        "You’re almost there! Now input the new password you’d like to use and that’s it!",
    },
  ];


  return (
    <div className="flex items-center h-screen w-full">
      <div className="bg-bgArmy w-1/2 h-full p-20 pb-32 flex flex-col justify-end">
        <div className="">
          <Image
            src="/icons/account.svg"
            alt="Icon vector"
            width={99}
            height={99}
          />
          <p className="font-bold my-4 text-2xl">Create an account</p>
          <p className="font-medium">
            Find vendors near you and get access to a wide range of products
            with ease. Sign up now to discover local businesses, compare prices,
            and shop confidently—all in one place.
          </p>
        </div>
      </div>
      <div className="bg-white text-black w-1/2 h-full flex justify-center items-center">
        <Signup />
        {/* <Signin /> */}
        {/* <ForgotPassword /> */}
        {/* <ResetPassword /> */}
      </div>
    </div>
  );
}
