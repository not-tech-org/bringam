import React, { useContext } from "react";
import Input from "../common/Input";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import Button from "../common/Button";

const SignupOTP = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const { onOtp, onChange, state, onResendOtp } = context;

  const { signupOTP } = state;

  return (
    <div
      className="rounded-3xl border-2 border-[#EDEDED] p-14 bg-[#FCFCFC]"
      style={{ width: 604 }}>
      <div className="text-center">
        <p className="font-bold text-2xl">Account Verification</p>
        <p className="font-semibold text-[#979797] text-sm mt-1">
          An OTP has been sent to your mail. Kindly input the code to get
          verified
        </p>
      </div>
      <form onSubmit={onOtp} className="mt-6">
        <Input
          label="Enter OTP"
          type="text"
          name="signupOTP"
          id="signupOTP"
          value={signupOTP}
          onChange={onChange}
          placeholder="Enter OTP"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Button type="submit" primary>
          Confirm
        </Button>
        <div className="text-center">
          <p className="text-textGray2">
            Didn&apos;t receive code?{" "}
            <span className="text-bgArmy">
              <span className="cursor-pointer" onClick={onResendOtp}>
                Resend
              </span>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupOTP;
