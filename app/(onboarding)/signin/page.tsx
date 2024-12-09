"use client";

import AuthLayout from "@/app/components/common/AuthLayout";
import React from "react";
import Signin from "../../components/auth/Signin";

const SigninPage = () => {
  return (
    <AuthLayout>
      <Signin />
    </AuthLayout>
  );
};

export default SigninPage;
