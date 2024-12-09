"use client"

import React, { useContext } from 'react'
import Input from '../common/Input';
import Button from '../common/Button';
import Link from 'next/link';
import { OnboardingContext } from '@/app/contexts/OnboardingContext';

const Signup = () => {
  const context = useContext(OnboardingContext);
  
  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const { onRouteChange, onChange, state } = context;

  const { firstName, lastName, email, password } = state;

  console.log("State: ", state);

  return (
    <div
      className="rounded-3xl border-2 border-[#EDEDED] p-14 bg-[#FCFCFC]"
      style={{ width: 604 }}>
      <div className="text-center">
        <p className="font-bold text-2xl">Create account</p>
        <p className="font-semibold text-[#979797] text-sm mt-1">
          Get started by creating an account
        </p>
      </div>
      <form onSubmit={undefined} className="w-full mt-6">
        <Input
          label="First Name"
          type="text"
          name="firstName"
          id="firstName"
          value={firstName}
          onChange={onChange}
          placeholder="Enter first name"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Input
          label="Last Name"
          type="text"
          name="lastName"
          id="lastName"
          value={lastName}
          onChange={onChange}
          placeholder="Enter last name"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Input
          label="Email Address"
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={onChange}
          placeholder="abc@gmail.com"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={onChange}
          placeholder="**************"
          className="border-gray-300 rounded w-100 mb-3"
        />
          <Button type="submit" primary>
            Create account
          </Button>
        <div className="text-center">
          <p className="text-textGray2">
            Already have an account?{" "}
            <span className="text-bgArmy">
              <span className='cursor-pointer' onClick={() => onRouteChange("signin")}>Sign in</span>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
