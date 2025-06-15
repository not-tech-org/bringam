"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  safeLocalStorage,
  updateUserData,
  getUserTypeInfo,
} from "@/app/lib/utils";

interface UserContextType {
  isVendorView: boolean;
  isVendorCapable: boolean;
  userName: string;
  switchToCustomer: () => void;
  switchToVendor: () => void;
  getDefaultRoute: () => string;
  updateUserState: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVendorView, setIsVendorView] = useState(false);
  const [isVendorCapable, setIsVendorCapable] = useState(false);
  const [userName, setUserName] = useState("User");
  const router = useRouter();

  // Initialize and update user state
  const updateUserState = () => {
    const { vendorCapable, vendorView, profileData } = getUserTypeInfo();

    // Update vendor capability first
    setIsVendorCapable(vendorCapable);

    // Update vendor view status - only if user is vendor capable
    setIsVendorView(vendorView);

    // Update user name
    let displayName = "User";
    if (
      vendorView &&
      profileData?.customerResp?.firstName &&
      profileData?.vendorResp?.businessName
    ) {
      displayName = `${profileData.customerResp.firstName} - (${profileData.vendorResp.businessName})`;
    } else if (profileData?.customerResp?.firstName) {
      displayName = profileData.customerResp.firstName;
    } else if (profileData?.vendorResp?.businessName) {
      displayName = profileData.vendorResp.businessName;
    }
    setUserName(displayName);
  };

  // Get the appropriate default route based on user type
  const getDefaultRoute = () => {
    const { vendorView } = getUserTypeInfo();
    // Default to vendor dashboard if user is in vendor view, otherwise customer all page
    return vendorView ? "/dashboard" : "/all";
  };

  const switchToCustomer = () => {
    const currentUserData = JSON.parse(
      safeLocalStorage.getItem("userDetails", '{"scope": []}')
    );

    const updatedUserData = {
      ...currentUserData,
      scope: currentUserData.scope?.filter((s: string) => s !== "VENDOR") || [],
    };

    updateUserData("userDetails", updatedUserData);
    router.push("/all");
  };

  const switchToVendor = () => {
    const currentUserData = JSON.parse(
      safeLocalStorage.getItem("userDetails", '{"scope": []}')
    );

    const currentScope = currentUserData.scope || [];
    const updatedScope = currentScope.includes("VENDOR")
      ? currentScope
      : [...currentScope, "VENDOR"];

    const updatedUserData = {
      ...currentUserData,
      scope: updatedScope,
    };

    updateUserData("userDetails", updatedUserData);
    router.push("/dashboard");
  };

  // Listen for localStorage changes to update state in real-time
  useEffect(() => {
    updateUserState();

    // Listen for storage changes (when localStorage is updated)
    const handleStorageChange = () => {
      updateUserState();
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events when localStorage is updated in the same tab
    window.addEventListener("userDataUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userDataUpdated", handleStorageChange);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        isVendorView,
        isVendorCapable,
        userName,
        switchToCustomer,
        switchToVendor,
        getDefaultRoute,
        updateUserState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
