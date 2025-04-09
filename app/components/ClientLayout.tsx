"use client";

import React, { ReactNode } from "react";
import { OnboardingProvider } from "../contexts/OnboardingContext";

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return <OnboardingProvider>{children}</OnboardingProvider>;
};

export default ClientLayout;
