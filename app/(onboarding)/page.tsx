"use client";

import Signup from "../components/auth/Signup";
import Signin from "../components/auth/Signin";
import ForgotPassword from "../components/auth/ForgotPassword";
import SignupOTP from "../components/auth/SignupOTP";
import { useContext } from "react";
import {
  OnboardingContext,
  OnboardingProvider,
} from "../contexts/OnboardingContext";
import ForgotPasswordOTP from "../components/auth/ForgotPasswordOTP";
import ResetPassword from "../components/auth/ResetPassword";
import AuthBrand from "../components/auth/AuthBrand";
import AuthVisualPanel from "../components/auth/AuthVisualPanel";

const authSteps: Record<string, AuthStepType> = {
  signup: {
    image: "/images/customer-signup.png",
    imageAlt: "A customer discovering products from local stores",
    eyebrow: "Shop with Bringam",
    title: "Create an account",
    description:
      "Discover nearby stores, compare products, and keep every order in one convenient place.",
  },
  SignupOTP: {
    image: "/images/customer-signup.png",
    imageAlt: "A customer discovering products from local stores",
    eyebrow: "Almost there",
    title: "Verify your account",
    description:
      "Confirm your email to finish setting up your Bringam account securely.",
  },
  signin: {
    image: "/images/customer-signin.png",
    imageAlt: "A customer checking her order after arriving home",
    eyebrow: "Welcome to Bringam",
    title: "Welcome back",
    description:
      "Sign in to continue shopping, manage your cart, and keep track of your orders.",
  },
  forgotPassword: {
    image: "/images/customer-signin.png",
    imageAlt: "A customer checking her order after arriving home",
    eyebrow: "Account recovery",
    title: "Forgot password?",
    description:
      "Enter your email address and we will send you a secure password reset code.",
  },
  forgotPasswordOTP: {
    image: "/images/customer-signin.png",
    imageAlt: "A customer checking her order after arriving home",
    eyebrow: "Account recovery",
    title: "Check your email",
    description:
      "Enter the reset code sent to your email address to continue.",
  },
  resetPassword: {
    image: "/images/customer-signin.png",
    imageAlt: "A customer checking her order after arriving home",
    eyebrow: "Account recovery",
    title: "Create a new password",
    description:
      "Choose a strong new password to regain access to your Bringam account.",
  },
};

interface AuthStepType {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
}

function Onboarding() {
  const context = useContext(OnboardingContext);

  const { state } = context || { state: { route: "signin" } };
  const { route } = state;
  const currentStep = authSteps[route] || authSteps.signin;

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

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

  return (
    <main className="h-[100vh] min-h-[100vh] max-h-[100vh] w-[100vw] min-w-[100vw] max-w-[100vw] overflow-hidden bg-white text-black lg:grid lg:grid-cols-[2fr_3fr]">
      <AuthVisualPanel
        imageSrc={currentStep.image}
        imageAlt={currentStep.imageAlt}
        eyebrow={currentStep.eyebrow}
        title={currentStep.title}
        description={currentStep.description}
      />

      <section className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
        <header className="shrink-0 border-b border-gray-100 px-5 py-5 sm:px-8 lg:border-b-0 lg:px-12 lg:py-7">
          <AuthBrand />
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
            <div className="flex w-full justify-center transition-all duration-300">
              {renderPages()}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const OnboardingPage = () => (
  <OnboardingProvider>
    <Onboarding />
  </OnboardingProvider>
);

export default OnboardingPage;
