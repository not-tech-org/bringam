"use client";

import React from "react";
import ForgotPassword from "../../components/auth/ForgotPassword";
import AuthLayout from "@/app/components/common/AuthLayout";

const ForgotPasswordPage = () => {
  return (
    <AuthLayout>
      <ForgotPassword />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
