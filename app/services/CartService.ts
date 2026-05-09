import axios from "axios";
import Cookies from "js-cookie";

/** Same token source for axios interceptors and cart “should sync?” checks (non-httpOnly cookie). */
export const getBringAmToken = (): string | undefined => {
  const fromCookie = Cookies.get("bringAmToken");
  if (fromCookie) return fromCookie;
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|;\s*)bringAmToken=([^;]+)/);
  if (!match?.[1]) return undefined;
  try {
    return decodeURIComponent(match[1].trim());
  } catch {
    return match[1].trim();
  }
};

/** Normalize API ids for cart payloads (trim strings; stringify finite numbers). */
export const normalizeClientStringId = (value: unknown): string | null => {
  if (value == null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") {
    const t = value.trim();
    return t.length > 0 ? t : null;
  }
  return null;
};

const baseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL;
};

const secoundaryUrl = () => {
  return {
    auth: "auth-service",
    vendor: "vendor-service",
    customer: "customer-service",
  };
};

// Create axios instance for customer service
const cartApi = axios.create({
  baseURL: `${baseUrl()}/${secoundaryUrl().customer}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to automatically include auth token
const addAuthInterceptor = (apiInstance: any) => {
  apiInstance.interceptors.request.use(
    (config: any) => {
      const token = getBringAmToken();
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

// Add auth interceptor to cart API instance
addAuthInterceptor(cartApi);

// Import types from cart types file to avoid duplication
import { ApiCartResponse } from "../types/cart";

export const extractAxiosMessage = (err: any): string => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Request failed"
  );
};

// Cart API Request Types
export interface AddToCartRequest {
  storeProductUuid: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  storeProductUuid: string;
}

export interface CartApiResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface CheckoutRequest {
  cartItemUUIDs: string[];
}

export interface CheckoutApiResponse {
  success: boolean;
  message: string;
  data: {
    subtotal?: number;
    subTotal?: number;
    amount?: number;
    paymentReference?: string;
    payment_reference?: string;
    reference?: string;
    checkoutSessionId?: string;
    checkout_session_id?: string;
    sessionId?: string;
    [key: string]: unknown;
  } | null;
}

// Get user cart from API
export const getUserCartApi = async (): Promise<ApiCartResponse> => {
  const response = await cartApi.get("/carts/get-user-cart");
  return response.data;
};

// Add item to cart via API
export const addItemToCartApi = async (
  cartUuid: string, 
  request: AddToCartRequest
): Promise<CartApiResponse> => {
  try {
    const response = await cartApi.put(`/carts/add-item-to-cart/${cartUuid}`, request);
    const data: CartApiResponse = response.data;
    if (!data?.success) {
      throw new Error(data?.message || "Failed to update cart");
    }
    return data;
  } catch (err: any) {
    throw new Error(extractAxiosMessage(err));
  }
};

// TODO: Add additional cart operations when endpoints are provided
// These are placeholder functions for future implementation:

// Update item quantity in cart via API
export const updateCartItemApi = async (
  cartUuid: string,
  cartItemId: string,
  quantity: number
): Promise<CartApiResponse> => {
  // Placeholder - implement when endpoint is available
  throw new Error("Update cart item API endpoint not yet implemented");
};

// Remove item from cart via API  
export const removeCartItemApi = async (
  cartUuid: string,
  storeProductUuid: string
): Promise<CartApiResponse> => {
  const request: RemoveFromCartRequest = {
    storeProductUuid: storeProductUuid
  };
  const response = await cartApi.post(`/carts/remove-item-from-cart/${cartUuid}`, request);
  return response.data;
};

// Clear entire cart via API
export const clearCartApi = async (
  cartUuid: string
): Promise<CartApiResponse> => {
  // Placeholder - implement when endpoint is available
  throw new Error("Clear cart API endpoint not yet implemented");
};

// Checkout selected cart items
export const checkoutApi = async (
  request: CheckoutRequest
): Promise<CheckoutApiResponse> => {
  const response = await cartApi.post("/checkout", request);
  return response.data;
};
