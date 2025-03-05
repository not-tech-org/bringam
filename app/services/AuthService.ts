import axios from "axios";

const baseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL;
};

const secoundaryUrl = () => {
  return {
    vendor: "vendor-service",
  }
}

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

export const createVendorStore = async (reqBody: object) => {
  console.log(`${baseUrl()}/${secoundaryUrl().vendor}/api/v1/stores`)
  console.log(reqBody)
} 