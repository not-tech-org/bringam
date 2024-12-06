import React from 'react'
import Input from '../common/Input';
import Button from '../common/Button';
import Link from 'next/link';

const Signin = () => {
  return (
    <div
      className="rounded-3xl border-2 border-[#EDEDED] p-14 bg-[#FCFCFC]"
      style={{ width: 604 }}
    >
      <div className="text-center">
        <p className="font-bold text-2xl">Sign in</p>
        <p className="font-semibold text-[#979797] text-sm mt-1">
          Sign in to your account
        </p>
      </div>
      <form className="w-full mt-6">
        <Input
          label="Email Address"
          type="text"
          name="lastName"
          id="lastName"
          value={""}
          onChange={() => console.log("Test")}
          placeholder="abc@gmail.com"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Input
          label="Password"
          type="text"
          name="lastName"
          id="lastName"
          value={""}
          onChange={() => console.log("Test")}
          placeholder="**************"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Button primary>Sign in</Button>
        <div className="text-center">
          <p className="text-textGray2">
            Forgot password?{" "}
            <span className="text-bgArmy">
              <Link href="#">Click here</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signin