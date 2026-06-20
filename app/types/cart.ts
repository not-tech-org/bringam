// Cart-related types and interfaces

// ===== EXISTING CART TYPES (Local Structure) =====
export interface CartItem {
  id: string;
  productId: string;
  /** Vendor store-product row UUID when API uses productUuid (maps to customer-service storeProductUuid). */
  productUuid?: string;
  storeProductUuid?: string;
  storeId: string;
  storeName: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  addedAt: string;
}

export interface CartStore {
  storeId: string;
  storeName: string;
  items: CartItem[];
  total: number;
}

export interface Cart {
  stores: CartStore[];
  totalItems: number;
  totalAmount: number;
  lastUpdated: string;
}

// ===== API CART TYPES (Server Structure) =====

/** Matches the API's CartItemResp schema — each cart line item has its own UUID. */
export interface ServerCartItem {
  uuid: string;
  cartUuid: string;
  quantity: number;
  storeProduct: ServerStoreProduct;
}

/** Nested store-product object inside CartItemResp. */
export interface ServerStoreProduct {
  productId?: number;
  productUuid: string;
  productName: string;
  price: number;
  storeId?: number;
  vendorUuid?: string;
  productImages?: string[];
  availability?: string;
  noInStock?: number;
}

/** Matches the API's CartResp schema. */
export interface ApiCartData {
  uuid: string;
  status: string;
  cartItems: ServerCartItem[];
}

export interface ApiCartResponse {
  success: boolean;
  message: string;
  data: ApiCartData;
}

/**
 * Legacy flat cart-item type for API responses (may be returned by older endpoints).
 * Keep for backward compatibility.
 */
export interface ApiCartItem {
  id?: string;
  productId: string;
  storeId: string;
  storeName: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  addedAt?: string;
}

// ===== CART LOADING & ERROR STATES =====
export interface CartLoadingState {
  isLoading: boolean;
  isLoadingCart: boolean;
  isUpdating: boolean;
  isSyncing: boolean;
}

export interface CartErrorState {
  error: string | null;
  apiError: string | null;
  syncError: string | null;
}

// ===== CART TRANSFORMATION TYPES =====
export interface CartTransformationOptions {
  preserveLocalIds?: boolean;
  mergeStrategy?: 'api_priority' | 'local_priority' | 'quantity_sum';
  conflictResolution?: 'ask_user' | 'auto_resolve';
}

// ===== CART SYNC TYPES =====
export interface CartSyncConflict {
  hasConflict: boolean;
  localCart: Cart;
  apiCart: Cart;
  conflictType: 'local_newer' | 'api_newer' | 'different_items';
}

// ===== CART UTILITY TYPES =====
export type CartItemKey = `${string}-${string}`; // productId-storeId combination
export type CartOperationResult = {
  success: boolean;
  error?: string;
  data?: any;
};

// ===== EXTENDED CART CONTEXT =====
export interface CartContextType {
  // Cart Data
  cart: Cart;
  apiCartData: ApiCartData | null;
  
  // Loading States
  loading: CartLoadingState;
  
  // Error States
  error: CartErrorState;
  
  // Cart Operations (Existing - now with API integration)
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt' | 'quantity'>) => Promise<CartOperationResult>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getTotalAmount: () => number;
  
  // API Cart Operations (New)
  fetchCartFromApi: () => Promise<void>;
  syncCartWithApi: () => Promise<void>;
  resolveCartConflict: (resolution: 'use_local' | 'use_api' | 'merge') => void;
  
  // Utility Functions
  isCartLoaded: boolean;
  hasApiConnection: boolean;
}
