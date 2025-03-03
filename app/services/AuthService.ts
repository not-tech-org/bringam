import axios from "axios";
import Cookies from "js-cookie";

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
    `${BACKEND_URL}/auth-service/api/v1/logout`,
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
