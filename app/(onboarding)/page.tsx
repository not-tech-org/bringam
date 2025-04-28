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
import ForgotPasswordOTP from "../components/auth/ForgotPasswordOTP";
import ResetPassword from "../components/auth/ResetPassword";

const authSteps = [
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
      "Signin to your account to continue shopping. Locate vendors and find the best deals around you",
  },
  {
    asset: "/icons/padlock.svg",
    title: "Forgot password?",
    description:
      "Easy! Just enter your Email address and get the password reset code sent to you in seconds!",
  },
  {
    asset: "/icons/padlock.svg",
    title: "Reset password?",
    description:
      "Good, now enter the password reset code that was sent to your Email address.",
  },
  {
    asset: "/icons/padlock.svg",
    title: "New password?",
    description:
      "You're almost there! Now input the new password you'd like to use and that's it!",
  },
];

interface AuthStepType {
  asset: string;
  title: string;
  description: string;
}

function Onboarding() {
  const context = useContext(OnboardingContext);
  const [currentStep, setCurrentStep] = useState<AuthStepType | null>(null);

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const { state } = context;
  const { route } = state;

  // Render the appropriate component based on the current route
  const renderPages = () => {
    switch (route) {
      case "signin":
        return <Signin />;
      case "signup":
        return <Signup />;
      case "forgotPassword":
        return <ForgotPassword />;
      case "forgotPasswordOTP":
        return <ForgotPasswordOTP />;
      case "SignupOTP":
        return <SignupOTP />;
      case "resetPassword":
        return <ResetPassword />;
      default:
        return <Signin />;
    }
  };

  // Update the current step whenever the route changes
  useEffect(() => {
    let stepIndex = 0;

    switch (route) {
      case "signin":
        stepIndex = 1;
        break;
      case "signup":
      case "SignupOTP":
        stepIndex = 0;
        break;
      case "forgotPassword":
        stepIndex = 2;
        break;
      case "forgotPasswordOTP":
        stepIndex = 3;
        break;
      case "resetPassword":
        stepIndex = 4;
        break;
      default:
        stepIndex = 1; // default to signin
    }

    setCurrentStep(authSteps[stepIndex]);
  }, [route]);

  return (
    <div className="flex flex-col md:flex-row items-center h-screen w-full">
      {/* Left side - hidden on mobile */}
      <div className="hidden md:flex bg-bgArmy w-full h-full p-8 md:p-20 pb-32 flex-col justify-end text-white">
        <div className="animate-fadeIn transition-all duration-300">
          <Image
            src={currentStep?.asset || "/icons/welcomeBack.svg"}
            alt="Icon vector"
            width={99}
            height={99}
          />
          <p className="font-bold my-4 text-2xl">{currentStep?.title}</p>
          <p className="font-medium">{currentStep?.description}</p>
        </div>
      </div>

      {/* Right side - full width on mobile */}
      <div className="bg-white text-black w-full h-full min-h-screen py-8 mx-auto flex justify-center items-center overflow-y-auto scrollbar-hide">
        <div className="animate-fadeIn transition-all duration-300">
          {renderPages()}
        </div>
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
