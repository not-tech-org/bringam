// Common types and interfaces shared across the application

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
  success?: boolean;
}

export interface User {
  id: string;
  uuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isVendor?: boolean;
  vendorResp?: VendorData;
}

export interface VendorData {
  id: string;
  uuid: string;
  businessName?: string;
  businessType?: string;
  isActive: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface FormError {
  field: string;
  message: string;
}

// Toast types
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
