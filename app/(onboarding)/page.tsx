"use client";

import Signup from "../components/auth/Signup";
import AuthLayout from "../components/common/AuthLayout";

export default function Onboarding() {
  return (
    <AuthLayout>
      <Signup />
    </AuthLayout>
  );
}
