"use client";

import React, { useContext, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import Cookies from "js-cookie";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import { signinApi, getUserProfile } from "@/app/services/AuthService";
import { useRouter } from "next/navigation";
import { validateEmail, showToast } from "../utils/helperFunctions";
import { safeLocalStorage, getUserTypeInfo } from "@/app/lib/utils";
import { motion } from "framer-motion";

// Animation variants for subtle form interactions
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
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
    return isValid;
  };

  // Fetch user profile and save customer data to localStorage
  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      console.log("User profile response:", response.data);

      // Extract customerResp from the response
      if (response.data.data.customerResp) {
        const customerData = response.data.data.customerResp;
        console.log("Customer data:", customerData);

        // Save customer data to localStorage
        safeLocalStorage.setItem("customerData", JSON.stringify(customerData));

        // Also save the full user details (keeping existing functionality)
        safeLocalStorage.setItem(
          "profileDetails",
          JSON.stringify(response.data.data)
        );

        console.log("Customer data saved to localStorage:", {
          uuid: customerData.uuid,
          firstName: customerData.firstName,
          picture: customerData.picture,
        });

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
    if (!validateForm()) {
      // Show only one error message to avoid overwhelming the user
      if (errors.email) {
        showToast(errors.email, "error");
      } else if (errors.password) {
        showToast(errors.password, "error");
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
        // Server responded with an error status
        const errorMessage =
          err.response.data.message || "Authentication failed";
        showToast(errorMessage, "error");

        if (err.response.status === 401) {
          // Handle invalid credentials specifically
          showToast("Invalid email or password", "error");
        }
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
      className="rounded-3xl border-2 border-[#EDEDED] p-8 md:p-14 bg-[#FCFCFC] w-[90%] max-w-[604px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="text-center"
        variants={itemVariants}
      >
        <p className="font-bold text-xl md:text-2xl">Sign in</p>
        <p className="font-semibold text-[#979797] text-xs md:text-sm mt-1">
          Sign in to your account
        </p>
      </motion.div>
      <motion.form 
        className="w-full mt-4 md:mt-6" 
        onSubmit={onSignIn}
        variants={itemVariants}
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
            placeholder="abc@gmail.com"
            className="border-gray-300 rounded w-100 mb-3"
            error={errors.email}
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
            className="border-gray-300 rounded w-100 mb-3"
            error={errors.password}
          />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Button type="submit" primary className="w-full" isLoading={isLoading}>
            Sign in
          </Button>
        </motion.div>

        <motion.div 
          className="text-center mt-4"
          variants={itemVariants}
        >
          <p className="text-textGray2">
            {"Don't"} have an account?{" "}
            <motion.span
              className="text-bgArmy cursor-pointer font-medium"
              onClick={() => onRouteChange("signup")}
              variants={linkVariants}
              whileHover="hover"
            >
              Sign up
            </motion.span>
          </p>
          <div className="mt-2">
            <motion.p
              className="cursor-pointer text-textGray2 hover:text-bgArmy transition-colors"
              onClick={() => onRouteChange("forgotPassword")}
              variants={linkVariants}
              whileHover="hover"
            >
              Forgot password?
            </motion.p>
          </div>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default Signin;
