"use client";

import Image from "next/image";
import Signup from "../components/auth/Signup";
import Signin from "../components/auth/Signin";
import ForgotPassword from "../components/auth/ForgotPassword";
import SignupOTP from "../components/auth/SignupOTP";
import { useContext, useEffect, useState } from "react";
import {
  OnboardingContext,
  OnboardingProvider,
} from "../contexts/OnboardingContext";

const authStep = [
  {
    asset: "/icons/account.svg",
    title: "Create an account",
    description:
      "Find vendors near you and get access to a wide range of products with ease. Sign up now to discover local businesses, compare prices, and shop confidently—all in one place.",
  },
  {
    asset: "/icons/welcomeBack.svg",
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

interface authStepType {
  asset: string;
  title: string;
  description: string;
}
[];

function Onboarding() {
  const context = useContext(OnboardingContext);
  const [description, setDescription] = useState<authStepType>();

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const { state } = context;

  // console.log(context);

  const { route } = state;

  const renderPages = () => {
    console.log(route);

    switch (route) {
      case "signin":
        return <Signin />;
      case "signup":
        return <Signup />;
      case "forgotPassword":
        return <ForgotPassword />;
      case "SignupOTP":
        return <SignupOTP />;
      default:
        return <Signup />;
    }
  };

  const renderDescription = () => {
    switch (route) {
      case "signin":
        setDescription(authStep[1]);
      case "signup":
        setDescription(authStep[0]);
      case "SignupOTP":
        setDescription(authStep[0]);
      case "forgotPassword":
        return <ForgotPassword />;
      default:
        setDescription(authStep[0]);
    }
  };

  useEffect(() => {
    // onRouteChange("SignupOTP");
    renderDescription();
  }, [route]);

  return (
    <div className="flex items-center h-screen w-full">
      <div className="bg-bgArmy w-1/2 h-full p-20 pb-32 flex flex-col justify-end">
        <div className="">
          <Image
            src={description ? description?.asset : "/icons/account.svg"}
            alt="Icon vector"
            width={99}
            height={99}
          />
          <p className="font-bold my-4 text-2xl">{description?.title}</p>
          <p className="font-medium">{description?.description}</p>
        </div>
      </div>
      <div className="bg-white text-black w-1/2 h-full flex justify-center items-center">
        {renderPages()}
      </div>
    </div>
  );
}

const OnboardingPage = () => (
  <OnboardingProvider>
    <Onboarding />
  </OnboardingProvider>
);

export default OnboardingPage;
