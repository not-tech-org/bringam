"use client";

import React, { useContext, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Cookies from "js-cookie";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import { signinApi, getUserProfile } from "@/app/services/AuthService";
import { useRouter } from "next/navigation";
import { validateEmail, showToast } from "../utils/helperFunctions";
import { safeLocalStorage } from "@/app/lib/utils";
import { motion } from "framer-motion";

// Animation variants for subtle form interactions
const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0
  }
};

const linkVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.15
    }
  }
};

const Signin = () => {
  const context = useContext(OnboardingContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const router = useRouter();

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const { onRouteChange, onChange, state } = context;
  const { email, password } = state;

  // Validate form inputs
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  // Fetch user profile and save customer data to localStorage
  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();

      // Extract customerResp from the response
      if (response.data.data.customerResp) {
        const customerData = response.data.data.customerResp;

        // Save customer data to localStorage
        safeLocalStorage.setItem("customerData", JSON.stringify(customerData));

        // Also save the full user details (keeping existing functionality)
        safeLocalStorage.setItem(
          "profileDetails",
          JSON.stringify(response.data.data)
        );

        // Trigger custom event to notify UserContext of localStorage updates
        window.dispatchEvent(new Event("userDataUpdated"));
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);

      // Extract error message for user feedback
      let errorMessage = "Failed to load user profile";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "warning");
    }
  };

  // Determine appropriate route based on user type
  const getDefaultRoute = () => {
    // Always default to customer view first, regardless of vendor capabilities
    // Users can switch to vendor view later if they want to
    return "/all";
  };

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateForm();

    if (!validation.isValid) {
      // Show only one error message to avoid overwhelming the user
      const errorKey = Object.keys(validation.errors)[0] as keyof typeof validation.errors;
      if (errorKey && validation.errors[errorKey]) {
        showToast(validation.errors[errorKey]!, "error");
      }
      return;
    }

    const formApiData = {
      username: email,
      password,
    };

    setIsLoading(true);

    try {
      const res = await signinApi(formApiData);

      // Save token to cookies
      Cookies.set("bringAmToken", res.data.data.access_token, {
        expires: 7, // Set a reasonable expiry time (7 days)
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Restrict cookie to same site
      });
      
      // Ensure user starts in customer view by default, even if they have vendor capabilities
      const userData = res.data.data;
      const updatedUserData = {
        ...userData,
        scope: userData.scope?.filter((s: string) => s !== "VENDOR") || []
      };
      safeLocalStorage.setItem("userDetails", JSON.stringify(updatedUserData));

      // Show success message
      showToast(res.data.message || "Signed in successfully", "success");

      // Fetch user profile and save customer data
      await fetchUserProfile();

      // Get the appropriate route based on user type
      const defaultRoute = getDefaultRoute();

      // Redirect to appropriate route
      router.push(defaultRoute);
    } catch (err: any) {
      // Handle different types of errors
      if (err.response) {
        showToast(
          err.response.data.message || "Unable to sign in. Please try again.",
          "error"
        );
      } else if (err.request) {
        // Request was made but no response received
        showToast("Network error. Please check your connection.", "warning");
      } else {
        // Other errors
        showToast("An unexpected error occurred. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-[620px]"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      transition={{ type: "spring", duration: 0.5 }}
    >
      <motion.div variants={itemVariants}>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#586a65]">
          Customer account
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
          Sign in to continue shopping and manage your orders.
        </p>
      </motion.div>
      <motion.form
        className="mt-8 w-full"
        onSubmit={onSignIn}
        variants={itemVariants}
        noValidate
      >
        <motion.div variants={itemVariants}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => {
              onChange(e);
              // Clear error when user types
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder="you@example.com"
            className="mb-5 w-full rounded-lg border border-gray-300 bg-white transition-colors focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
            error={errors.email}
            required
            autoComplete="email"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => {
              onChange(e);
              // Clear error when user types
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            placeholder="**************"
            className="mb-5 w-full rounded-lg border border-gray-300 bg-white transition-colors focus:border-gray-700 focus:ring-2 focus:ring-gray-200"
            error={errors.password}
            required
            autoComplete="current-password"
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
        >
          <Button
            type="submit"
            primary
            className="!my-2 min-h-12 w-full rounded-lg text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign in
          </Button>
        </motion.div>

        <motion.div className="mt-5 text-center" variants={itemVariants}>
          <p className="text-sm text-gray-600">
            {"Don't"} have an account?{" "}
            <motion.button
              type="button"
              className="font-semibold text-bgArmy hover:underline focus:outline-none focus:ring-2 focus:ring-bgArmy focus:ring-offset-2"
              onClick={() => onRouteChange("signup")}
              variants={linkVariants}
              whileHover="hover"
            >
              Sign up
            </motion.button>
          </p>
          <div className="mt-3">
            <motion.button
              type="button"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-bgArmy hover:underline focus:outline-none focus:ring-2 focus:ring-bgArmy focus:ring-offset-2"
              onClick={() => onRouteChange("forgotPassword")}
              variants={linkVariants}
              whileHover="hover"
            >
              Forgot password?
            </motion.button>
          </div>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default Signin;
