import React, { useContext } from "react";
import Input from "../common/Input";
import { OnboardingContext } from "@/app/contexts/OnboardingContext";
import Button from "../common/Button";

const ForgotPasswordOTP = () => {
  const context = useContext(OnboardingContext);

  if (!context) {
    return <div>Error: OnboardingContext not found</div>;
  }

  const { onRouteChange, onChange, state } = context;

  const { forgotPasswordOTP } = state;

  return (
    <div
      className="rounded-3xl border-2 border-[#EDEDED] p-14 bg-[#FCFCFC]"
      style={{ width: 604 }}
    >
      <div className="text-center">
        <p className="font-bold text-2xl">Forgot Password</p>
        <p className="font-semibold text-[#979797] text-sm mt-1">
          An OTP has been sent to your mail. Kindly input the code to get
          continue
        </p>
      </div>
      <div className="mt-6">
        <Input
          label="Enter OTP"
          type="text"
          name="forgotPasswordOTP"
          id="forgotPasswordOTP"
          value={forgotPasswordOTP}
          onChange={onChange}
          placeholder="Enter OTP"
          className="border-gray-300 rounded w-100 mb-3"
        />
        <Button primary>Confirm</Button>
        <div className="text-center">
          <p className="text-textGray2">
            Didn't receive code?{" "}
            <span className="text-bgArmy">
              <span
                className="cursor-pointer"
                // onClick={() => onRouteChange("signin")}
              >
                Resend
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOTP;
