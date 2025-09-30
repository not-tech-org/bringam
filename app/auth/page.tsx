"use client"

// pages/auth.tsx
import React, { useState } from 'react';
import Signin from '@/app/components/auth/Signin';
import Signup from '@/app/components/auth/Signup';

const AuthPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center w-1/2">
        {isSignIn ? <Signin /> : <Signup />}
      </div>
      <div className="w-1/2">
        {/* Your image or any other content */}
      </div>
    </div>
  );
};

export default AuthPage;
