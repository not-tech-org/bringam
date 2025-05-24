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

// Create axios instance for auth service
const authApi = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create axios instance for vendor service
const vendorApi = axios.create({
  baseURL: `${baseUrl()}/${secoundaryUrl().vendor}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to automatically include auth token
const addAuthInterceptor = (apiInstance: any) => {
  apiInstance.interceptors.request.use(
    (config: any) => {
      const token = Cookies.get("bringAmToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
};

// Add auth interceptor to both instances
addAuthInterceptor(authApi);
addAuthInterceptor(vendorApi);

export const signupApi = async (data: object) => {
  const response = await authApi.post("/registration/customer-sign-up", data);
  return response;
};

export const signinApi = async (data: object) => {
  const response = await authApi.post("/login", data);
  return response;
};

export const otpApi = async (otp: string) => {
  const response = await authApi.post(`/otp/verify-otp-at-signup/${otp}`, null);
  return response;
};

export const resendOtpApi = async (otp: string) => {
  const response = await authApi.post(`/otp/resend-otp-at-signup/${otp}`, null);
  return response;
};

export const forgotPasswordApi = async (email: string) => {
  const response = await authApi.post(
    `/forgot-password/initiate-password-reset/${email}`,
    null
  );
  return response;
};

export const forgotPasswordOtpVerifyApi = async (otp: string) => {
  const response = await authApi.post(
    `/forgot-password/verify-password-reset-token/${otp}`,
    null
  );
  return response;
};

export const resetPasswordApi = async (data: {
  newPassword: string;
  confirmNewPassword: string;
}) => {
  const response = await authApi.post("/forgot-password/reset-password", data);
  return response;
};

export const createVendorStore = async (reqBody: object) => {
  const response = await vendorApi.post("/stores", reqBody);
  return response;
};

export const becomeVendorApi = async (data: object) => {
  const response = await authApi.post("/customers/become-a-vendor", data);
  return response;
};

export const logoutApi = async () => {
  const response = await authApi.post("/logout", {});
  document.cookie =
    "authentication=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  localStorage.clear();
  window.location.href = "/";
  return response;
};

export const getUserProfile = async () => {
  const response = await authApi.get("/users/get-user-profile");
  return response;
};

export const getAllStores = async (vendorUuid: string) => {
  const response = await vendorApi.get(`/stores?vendorUuid=${vendorUuid}`);
  return response;
};

export const getStoreById = async (storeUuid: string) => {
  const response = await vendorApi.get(`/stores/${storeUuid}`);
  return response;
};
