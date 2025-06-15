"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { safeLocalStorage } from "@/app/lib/utils";

interface UserContextType {
  isVendorView: boolean;
  isVendorCapable: boolean;
  userName: string;
  switchToCustomer: () => void;
  switchToVendor: () => void;
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
    const userType = JSON.parse(
      safeLocalStorage.getItem("userDetails", '{"scope": []}')
    );
    const profileData = JSON.parse(
      safeLocalStorage.getItem("profileDetails", "{}")
    );

    // Update vendor view status
    const vendorView = Boolean(userType?.scope?.includes("VENDOR"));
    setIsVendorView(vendorView);

    // Update vendor capability
    const vendorCapable = Boolean(profileData?.vendorResp?.uuid);
    setIsVendorCapable(vendorCapable);

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

  const switchToCustomer = () => {
    const currentUserData = JSON.parse(
      safeLocalStorage.getItem("userDetails", '{"scope": []}')
    );

    const updatedUserData = {
      ...currentUserData,
      scope: currentUserData.scope?.filter((s: string) => s !== "VENDOR") || [],
    };

    safeLocalStorage.setItem("userDetails", JSON.stringify(updatedUserData));
    updateUserState(); // Update state immediately
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

    safeLocalStorage.setItem("userDetails", JSON.stringify(updatedUserData));
    updateUserState(); // Update state immediately
    router.push("/dashboard");
  };

  useEffect(() => {
    updateUserState();
  }, []);

  return (
    <UserContext.Provider
      value={{
        isVendorView,
        isVendorCapable,
        userName,
        switchToCustomer,
        switchToVendor,
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
