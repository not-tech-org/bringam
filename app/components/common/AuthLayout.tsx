"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center h-screen w-full">
      <div className="bg-bgArmy w-1/2 h-full p-20 pb-32 flex flex-col justify-end">
        <div className="">
          <Image
            src="/icons/account.svg"
            alt="Icon vector"
            width={99}
            height={99}
          />
          <p className="font-bold my-4 text-2xl">Create an account</p>
          <p className="font-medium">
            Find vendors near you and get access to a wide range of products
            with ease. Sign up now to discover local businesses, compare prices,
            and shop confidently—all in one place.
          </p>
        </div>
      </div>
      <div className="bg-white text-black w-1/2 h-full flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
