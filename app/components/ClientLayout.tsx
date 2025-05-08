"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { OnboardingProvider } from "@/app/contexts/OnboardingContext";

interface ClientLayoutProps {
  children: ReactNode;
}

// This component ensures that client-side code only runs in the browser
export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Only show content after component mounts in the browser
  useEffect(() => {
    setIsMounted(true);

    // Polyfill localStorage for SSR if not available
    if (typeof window !== "undefined" && !window.localStorage) {
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: () => null,
          setItem: () => null,
          removeItem: () => null,
        },
      });
    }
  }, []);

  // During SSR and first mount, don't render anything that might use browser APIs
  if (!isMounted) {
    // Return a lightweight loading state
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return <OnboardingProvider>{children}</OnboardingProvider>;
}
