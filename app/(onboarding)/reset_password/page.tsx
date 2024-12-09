"use client";

import AuthLayout from "@/app/components/common/AuthLayout";
import React from "react";
import ResetPassword from "../../components/auth/ResetPassword";

const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <ResetPassword />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
