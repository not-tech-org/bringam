import React from 'react'
import Input from '../common/Input';
import Button from '../common/Button';
import Link from 'next/link';

const ResetPassword = () => {
  return (
    <div
      className="rounded-3xl border-2 border-[#EDEDED] p-14 bg-[#FCFCFC]"
      style={{ width: 604 }}
    >
      <div className="text-center">
        <p className="font-bold text-2xl">Create a new password</p>
        <p className="font-semibold text-[#979797] text-sm mt-1">
          Enter your new password
        </p>
      </div>
      <form className="w-full mt-6">
        <Input
          label="New Password"
          type="text"
          name="newPassword"
          id="newPassword"
          value={""}
          onChange={() => console.log("Test")}
          placeholder="************"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Input
          label="Confirm New Password"
          type="text"
          name="confirmNewPassword"
          id="confirmNewPassword"
          value={""}
          onChange={() => console.log("Test")}
          placeholder="************"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Button primary>Reset password</Button>
        {/* <div className="text-center">
          <p className="text-textGray2">
            Didn't receive a code?{" "}
            <span className="text-bgArmy">
              <Link href="#">Resend</Link>
            </span>
          </p>
        </div> */}
      </form>
    </div>
  );
}

export default ResetPassword