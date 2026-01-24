import axios from "axios";
import Cookies from "js-cookie";

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

// Add auth interceptor to cart API instance
addAuthInterceptor(cartApi);

// Import types from cart types file to avoid duplication
import { ApiCartResponse } from "../types/cart";

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
  const response = await cartApi.post(`/carts/add-item-to-cart/${cartUuid}`, request);
  return response.data;
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