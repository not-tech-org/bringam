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

/**
 * Vendor-service store-product payloads often use `productUuid` for the row id.
 * Cart lines may expose `storeProductUuid`, `productId`, or `uuid` — honor all.
 */
/**
 * Resolve a store-product UUID from an API payload (either the raw product object
 * or a cart item), handling all known field-name variations the backend returns.
 *
 * Priority order:
 * 1. storeProductUuid / storeProductUUID  (used in cart-related payloads)
 * 2. productUuid / productUUID            (StoreProductResp from vendor-service)
 * 3. uuid                                 (ProductResp from vendor-service)
 * 4. storeProductId                       (legacy numeric id)
 * 5. productId (number)                   (numeric id on StoreProductResp/ProductResp)
 *
 * Returns null when no valid identifier is found.
 */
export const resolveStoreProductUuidFromPayload = (
  item: unknown
): string | null => {
  if (!item || typeof item !== "object") return null;
  const row = item as Record<string, unknown>;
  return (
    normalizeClientStringId(row.storeProductUuid) ||
    normalizeClientStringId(row.storeProductUUID) ||
    normalizeClientStringId(row.productUuid) ||
    normalizeClientStringId(row.productUUID) ||
    normalizeClientStringId(row.uuid) ||
    normalizeClientStringId(row.storeProductId) ||
    normalizeClientStringId(row.productId) ||
    null
  );
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
import type { ApiCartResponse } from "../types/cart";

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
  /** APIResponseString — `data` is a string (may contain the newly-created cart item UUID). */
  data: string | null;
}

export interface CheckoutRequest {
  cartItemUUIDs: string[];
}

/** Matches CustomerCheckoutSessionResp — server may return various field name formats. */
export interface CheckoutApiResponse {
  success: boolean;
  message: string;
  data: Record<string, unknown> | null;
}

export interface PlaceOrderRequest {
  checkoutSessionUuid: string;
  addressUuid?: string;
  deliveryOption?: string;
  deliveryAddressUuid?: string;
}

/** Matches CustomerPlaceOrderResp — real order id and payment reference. */
export interface PlaceOrderResponse {
  orderUuid: string;
  paymentReference: string;
  amount: number;
}

export interface PlaceOrderApiResponse {
  success: boolean;
  message: string;
  data: PlaceOrderResponse | null;
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

// Update item quantity in cart via API (PUT /add-item-to-cart with quantity)
export const updateCartItemApi = async (
  cartUuid: string,
  storeProductUuid: string,
  quantity: number
): Promise<CartApiResponse> => {
  const request: AddToCartRequest = {
    storeProductUuid,
    quantity,
  };
  const response = await cartApi.put(`/carts/add-item-to-cart/${cartUuid}`, request);
  const data: CartApiResponse = response.data;
  if (!data?.success) {
    throw new Error(data?.message || "Failed to update cart item");
  }
  return data;
};

// Remove item from cart via API — uses DELETE with a JSON body (axios.delete supports it via config.data)
export const removeCartItemApi = async (
  cartUuid: string,
  storeProductUuid: string
): Promise<CartApiResponse> => {
  const request: RemoveFromCartRequest = {
    storeProductUuid: storeProductUuid
  };
  const response = await cartApi.delete(`/carts/remove-item-from-cart/${cartUuid}`, {
    data: request,
  });
  return response.data;
};

// Clear entire cart via API — fetch cart then remove items one by one
// The API doesn't expose a bulk-clear endpoint, so we iterate cart items.
export const clearCartApi = async (
  cartUuid: string
): Promise<CartApiResponse> => {
  // Fetch current cart to get items
  const cartResp = await getUserCartApi();
  if (!cartResp.success || !cartResp.data?.cartItems?.length) {
    return { success: true, message: "Cart already empty", data: null };
  }

  const items = cartResp.data.cartItems;
  for (const item of items) {
    const spUuid =
      item.storeProduct?.productUuid ||
      item.storeProduct?.productId?.toString() ||
      "";
    if (spUuid) {
      await removeCartItemApi(cartUuid, spUuid);
    }
  }

  return { success: true, message: "Cart cleared", data: null };
};

// Checkout selected cart items
export const checkoutApi = async (
  request: CheckoutRequest
): Promise<CheckoutApiResponse> => {
  try {
    const response = await cartApi.post("/checkout", request);
    return response.data;
  } catch (err: unknown) {
    throw new Error(extractAxiosMessage(err));
  }
};

// Finalize order after payment (POST /place-order)
export const placeOrderApi = async (
  request: PlaceOrderRequest
): Promise<PlaceOrderApiResponse> => {
  try {
    const response = await cartApi.post("/place-order", request);
    return response.data;
  } catch (err: unknown) {
    throw new Error(extractAxiosMessage(err));
  }
};

// ===== ADDRESS API FUNCTIONS =====

/**
 * Create a new customer address.
 *
 * Per the API spec (`AddressReq`), `city`, `state`, and `country` are **integer** (int64) entity IDs.
 * We accept optional number values and include them only when provided — this mirrors the
 * vendor-store address pattern (see `app/vendor-store/page.tsx`).
 */
export const createCustomerAddressApi = async (request: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  street: string;
  landmark?: string;
  defaultAddress?: boolean;
  city?: number;
  state?: number;
  country?: number;
  /**
   * Longitude coordinate for the address.
   * The backend requires this field — use browser geolocation
   * or a sensible default (e.g. Lagos, Nigeria) when unavailable.
   */
  longitude: number;
  /**
   * Latitude coordinate for the address.
   * The backend requires this field — use browser geolocation
   * or a sensible default (e.g. Lagos, Nigeria) when unavailable.
   */
  latitude: number;
}): Promise<{ success: boolean; message: string; data: { uuid: string } | null }> => {
  try {
    const payload: Record<string, unknown> = {
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phoneNumber: request.phoneNumber,
      street: request.street,
      longitude: request.longitude,
      latitude: request.latitude,
    };

    // Only include optional fields when they have a value
    if (request.landmark) payload.landmark = request.landmark;
    if (request.defaultAddress !== undefined) payload.defaultAddress = request.defaultAddress;
    if (request.city) payload.city = request.city;
    if (request.state) payload.state = request.state;
    if (request.country) payload.country = request.country;

    const response = await cartApi.post("/address", payload);
    return response.data;
  } catch (err: unknown) {
    throw new Error(extractAxiosMessage(err));
  }
};

// Get all customer addresses
export const getCustomerAddressesApi = async (): Promise<{
  success: boolean;
  message: string;
  data: Array<{ uuid: string; firstName: string; lastName: string; street: string; city: string; state: string; country: string }> | null;
}> => {
  try {
    const response = await cartApi.get("/address");
    return response.data;
  } catch (err: unknown) {
    throw new Error(extractAxiosMessage(err));
  }
};


