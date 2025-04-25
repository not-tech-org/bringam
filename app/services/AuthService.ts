import axios from "axios";
import Cookies from "js-cookie";

const baseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL;
};

const secoundaryUrl = () => {
  return {
    vendor: "vendor-service",
  };
};

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth-service/api/v1`;

export const signupApi = async (data: object) => {
  const response = await axios.post(
    `${BACKEND_URL}/registration/customer-sign-up`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const signinApi = async (data: object) => {
  const response = await axios.post(`${BACKEND_URL}/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const otpApi = async (otp: string) => {
  const response = await axios.post(
    `${BACKEND_URL}/otp/verify-otp-at-signup/${otp}`,
    null,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const resendOtpApi = async (otp: string) => {
  const response = await axios.post(
    `${BACKEND_URL}/otp/resend-otp-at-signup/${otp}`,
    null,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const forgotPasswordApi = async (email: string) => {
  const response = await axios.post(
    `${BACKEND_URL}/forgot-password/initiate-password-reset/${email}`,
    null,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const forgotPasswordOtpVerifyApi = async (otp: string) => {
  const response = await axios.post(
    `${BACKEND_URL}/forgot-password/verify-password-reset-token/${otp}`,
    null,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const resetPasswordApi = async (data: {
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const response = await axios.post(
    `${BACKEND_URL}/forgot-password/reset-password`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
};

export const createVendorStore = async (reqBody: object) => {
  console.log(`${baseUrl()}/${secoundaryUrl().vendor}/api/v1/stores`);
  console.log(reqBody);
};
export const becomeVendorApi = async (data: object) => {
  const response = await axios.post(
    `${BACKEND_URL}/customers/become-a-vendor`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("bringAmToken")}`,
      },
    }
  );
  return response;
};

export const logoutApi = async () => {
  const response = await axios.post(
    // `${BACKEND_URL}/auth-service/api/v1/logout`,
    `${BACKEND_URL}/logout`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("bringAmToken")}`,
      },
    }
  );
  return response;
};
