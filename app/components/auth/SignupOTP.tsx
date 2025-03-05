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

  const { signupOTP, isLoading } = state;

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
        {isLoading === true ? (
          <Button type="button" primary className="" disabled>
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </Button>
        ) : (
          <Button type="submit" primary>
            Confirm
          </Button>
        )}

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
