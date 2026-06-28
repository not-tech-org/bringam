"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  Cart, 
  CartItem, 
  CartStore, 
  CartContextType, 
  ApiCartData,
  ServerCartItem,
  ApiCartItem,
  CartLoadingState,
  CartErrorState,
  CartSyncConflict,
  CartOperationResult
} from "../types/cart";
import {
  getUserCartApi,
  addItemToCartApi,
  removeCartItemApi,
  clearCartApi,
  AddToCartRequest,
  extractAxiosMessage,
  getBringAmToken,
  resolveStoreProductUuidFromPayload,
} from "../services/CartService";

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = "bringam_cart";

/** Survives StrictMode double-mount so bootstrap GET runs at most once per page load. */
let cartBootstrapFetchIssued = false;

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // ===== EXISTING STATE =====
  const [cart, setCart] = useState<Cart>({
    stores: [],
    totalItems: 0,
    totalAmount: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // ===== NEW API STATE =====
  const [apiCartData, setApiCartData] = useState<ApiCartData | null>(null);
  const [loading, setLoading] = useState<CartLoadingState>({
    isLoading: false,
    isLoadingCart: false,
    isUpdating: false,
    isSyncing: false,
  });
  const [error, setError] = useState<CartErrorState>({
    error: null,
    apiError: null,
    syncError: null,
  });
  const [hasApiConnection, setHasApiConnection] = useState(false);
  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever cart changes (but not on initial load)
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart, isLoaded]);

  // ===== NEW API EFFECTS =====
  // One optional bootstrap fetch: GET /carts/get-user-cart (same host as checkout).
  // Without a token the call cannot succeed — skip to avoid noisy failed requests.
  // Set NEXT_PUBLIC_DISABLE_BOOTSTRAP_CART_FETCH=true to turn off entirely (local-only debugging).
  useEffect(() => {
    if (!isLoaded || cartBootstrapFetchIssued) return;

    const disableBootstrap =
      process.env.NEXT_PUBLIC_DISABLE_BOOTSTRAP_CART_FETCH === "true" ||
      process.env.NEXT_PUBLIC_DISABLE_BOOTSTRAP_CART_FETCH === "1";

    if (disableBootstrap) return;
    if (!getBringAmToken()) return;

    cartBootstrapFetchIssued = true;

    fetchCartFromApi().catch(() => {
      // Silent fail - user can still use local cart
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // ===== UTILITY FUNCTIONS =====
  const calculateTotals = (stores: CartStore[]) => {
    const totalItems = stores.reduce((sum, store) => 
      sum + store.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const totalAmount = stores.reduce((sum, store) => sum + store.total, 0);
    return { totalItems, totalAmount };
  };

  /**
   * Transform API cart items to local cart structure.
   * Handles both nested (ServerCartItem with storeProduct sub-object) and
   * flat (ApiCartItem) response formats to be resilient to API changes.
   */
  const transformApiCartToLocal = (apiItems: any[]): Cart => {
    if (!apiItems || apiItems.length === 0) {
      return {
        stores: [],
        totalItems: 0,
        totalAmount: 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    // Detect format: nested format has storeProduct object, flat format has direct fields
    const first = apiItems[0];
    const isNested = first.storeProduct != null && typeof first.storeProduct === "object";

    const storeMap = new Map<string, CartStore>();

    apiItems.forEach((apiItem: any) => {
      let productId: string;
      let storeProductUuid: string;
      let storeId: string;
      let storeName: string;
      let name: string;
      let price: number;
      let image: string;
      let quantity: number;
      let category: string;
      let itemId: string;

      if (isNested) {
        // Nested CartItemResp format
        const sp = apiItem.storeProduct || {};
        productId = sp.productUuid || sp.productId?.toString() || "";
        storeProductUuid = sp.productUuid || "";
        storeId = sp.storeId?.toString() || apiItem.cartUuid || "";
        storeName = sp.productName || "Store";
        name = sp.productName || "";
        price = typeof sp.price === "number" ? sp.price : Number(sp.price) || 0;
        image = sp.productImages?.[0] || "";
        quantity = typeof apiItem.quantity === "number" ? apiItem.quantity : Number(apiItem.quantity) || 1;
        category = "";
        itemId = apiItem.uuid || `${productId}-${Date.now()}`;
      } else {
        // Flat ApiCartItem format
        productId = apiItem.productId || apiItem.id || "";
        storeProductUuid = apiItem.storeProductUuid || apiItem.productId || apiItem.id || "";
        storeId = apiItem.storeId?.toString() || "";
        storeName = apiItem.storeName || "Store";
        name = apiItem.name || "";
        price = typeof apiItem.price === "number" ? apiItem.price : Number(apiItem.price) || 0;
        image = apiItem.image || "";
        quantity = typeof apiItem.quantity === "number" ? apiItem.quantity : Number(apiItem.quantity) || 1;
        category = apiItem.category || "";
        itemId = apiItem.id || apiItem.uuid || `${productId}-${Date.now()}`;
      }

      const localItem: CartItem = {
        id: itemId,
        productId,
        storeProductUuid,
        storeId,
        storeName,
        name,
        price,
        image,
        quantity,
        category,
        addedAt: new Date().toISOString(),
      };

      const storeKey = storeId || `store-${storeProductUuid.slice(0, 8)}`;

      if (storeMap.has(storeKey)) {
        const store = storeMap.get(storeKey)!;
        store.items.push(localItem);
        store.total += price * quantity;
      } else {
        storeMap.set(storeKey, {
          storeId: storeKey,
          storeName,
          items: [localItem],
          total: price * quantity,
        });
      }
    });

    const stores = Array.from(storeMap.values());
    const { totalItems, totalAmount } = calculateTotals(stores);

    return {
      stores,
      totalItems,
      totalAmount,
      lastUpdated: new Date().toISOString(),
    };
  };

  // Transform local cart to API format
  const transformLocalCartToApi = (localCart: Cart): ApiCartItem[] => {
    const apiItems: ApiCartItem[] = [];
    
    localCart.stores.forEach(store => {
      store.items.forEach(item => {
        apiItems.push({
          id: item.id,
          productId: item.productId,
          storeId: item.storeId,
          storeName: item.storeName,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          category: item.category,
          addedAt: item.addedAt,
        });
      });
    });

    return apiItems;
  };

  // Clear error states
  const clearErrors = () => {
    setError({
      error: null,
      apiError: null,
      syncError: null,
    });
  };

  const ensureApiCartUuid = async (): Promise<string> => {
    if (apiCartData?.uuid) {
      return apiCartData.uuid;
    }

    try {
      const response = await getUserCartApi();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch cart from server");
      }
      if (!response.data?.uuid) {
        throw new Error("Server cart has no uuid");
      }
      setApiCartData(response.data);
      setHasApiConnection(true);
      // Don't sync local cart here — just fetch the UUID.
      // Cart sync happens separately in fetchCartFromApi after API operations complete.
      return response.data.uuid;
    } catch (err: any) {
      const msg = extractAxiosMessage(err);
      setError(prev => ({
        ...prev,
        apiError: msg,
      }));
      setHasApiConnection(false);
      throw new Error(msg);
    }
  };

  /**
   * Update the local cart state by adding the given item (or incrementing quantity
   * if the same product already exists in the same store). Returns the updated stores array.
   */
  const addItemToLocalCart = (
    prevCart: Cart,
    itemData: Omit<CartItem, 'id' | 'addedAt' | 'quantity'>,
    storeProductUuid: string | null
  ): Cart => {
    // Check if the exact product already exists in any store
    let existingItem: CartItem | undefined;
    let existingStoreIndex = -1;
    let existingItemIndex = -1;

    prevCart.stores.forEach((store, storeIdx) => {
      const itemIdx = store.items.findIndex(
        item =>
          item.productId === itemData.productId &&
          item.storeId === itemData.storeId
      );
      if (itemIdx !== -1) {
        existingItem = store.items[itemIdx];
        existingStoreIndex = storeIdx;
        existingItemIndex = itemIdx;
      }
    });

    let updatedStores: CartStore[];

    if (existingItem) {
      // Product exists, increment its quantity
      updatedStores = [...prevCart.stores];
      updatedStores[existingStoreIndex] = {
        ...updatedStores[existingStoreIndex],
        items: updatedStores[existingStoreIndex].items.map((item, idx) =>
          idx === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
      updatedStores[existingStoreIndex].total = updatedStores[existingStoreIndex].items.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      );
    } else {
      // Product doesn't exist, find or create store
      const storeIndex = prevCart.stores.findIndex(store => store.storeId === itemData.storeId);

      const newItem: CartItem = {
        ...itemData,
        id: `${itemData.productId}-${Date.now()}`,
        storeProductUuid: storeProductUuid ?? itemData.storeProductUuid,
        quantity: 1,
        addedAt: new Date().toISOString(),
      };

      if (storeIndex >= 0) {
        updatedStores = [...prevCart.stores];
        updatedStores[storeIndex] = {
          ...updatedStores[storeIndex],
          items: [...updatedStores[storeIndex].items, newItem],
          total: updatedStores[storeIndex].total + itemData.price,
        };
      } else {
        updatedStores = [
          ...prevCart.stores,
          {
            storeId: itemData.storeId,
            storeName: itemData.storeName,
            items: [newItem],
            total: itemData.price,
          },
        ];
      }
    }

    const { totalItems, totalAmount } = calculateTotals(updatedStores);

    return {
      stores: updatedStores,
      totalItems,
      totalAmount,
      lastUpdated: new Date().toISOString(),
    };
  };

  const addToCart = async (itemData: Omit<CartItem, 'id' | 'addedAt' | 'quantity'>) => {
    setLoading(prev => ({ ...prev, isUpdating: true }));
    clearErrors();

    // Resolve store product UUID from item data — this is the key identifier the API needs
    const storeProductUuid = resolveStoreProductUuidFromPayload(itemData);

    let apiError: string | null = null;
    let apiSynced = false;

    const token = getBringAmToken();
    const canSyncToServer = Boolean(token);

    // ============================================================
    // STEP 1: Update local cart IMMEDIATELY
    // This ensures the item is visible in the cart right away,
    // regardless of API sync status or response format issues.
    // ============================================================
    setCart(prevCart => addItemToLocalCart(prevCart, itemData, storeProductUuid));

    // ============================================================
    // STEP 2: Sync with server if authenticated (fire-and-forget)
    // ============================================================
    if (canSyncToServer) {
      try {
        const cartUuid = await ensureApiCartUuid();

        if (storeProductUuid) {
          await addItemToCartApi(cartUuid, {
            storeProductUuid,
            quantity: 1,
          });
          // Refresh cart from API to stay in sync (this will overwrite
          // the local state, but we already added the item locally so
          // there's no visual flash)
          await fetchCartFromApi();
          apiSynced = true;
        } else {
          console.warn(
            "[addToCart] Could not resolve storeProductUuid from itemData:",
            itemData
          );
          apiError = "Could not resolve product ID from the server data.";
        }
      } catch (err: any) {
        const msg = extractAxiosMessage(err);
        console.error("[addToCart] API call failed, cart stays local:", msg);
        apiError = msg;
        setError(prev => ({ ...prev, apiError: msg }));
      }
    }

    setLoading(prev => ({ ...prev, isUpdating: false }));

    if (!canSyncToServer) {
      return {
        success: true,
        data: { synced: false, reason: "unauthenticated" },
      };
    }

    if (!apiSynced) {
      return {
        success: true,
        data: {
          synced: false,
          ...(apiError ? { reason: "api_error" as const } : {}),
        },
        ...(apiError ? { error: apiError } : {}),
      };
    }

    return {
      success: true,
      data: { synced: true },
    };
  };

  const removeFromCart = async (itemId: string) => {
    // Set updating state
    setLoading(prev => ({ ...prev, isUpdating: true }));
    clearErrors();

    let shouldUseLocalFallback = true;
    const token = getBringAmToken();

    // Try to remove via API first if logged in (same rule as add-to-cart)
    if (token) {
      try {
        // Find the item to get its storeProductUuid for the API call
        let storeProductUuid = null;
        for (const store of cart.stores) {
          const item = store.items.find(item => item.id === itemId);
          if (item) {
            storeProductUuid = resolveStoreProductUuidFromPayload(item);
            break;
          }
        }

        if (storeProductUuid) {
          const cartUuid = await ensureApiCartUuid();
          await removeCartItemApi(cartUuid, storeProductUuid);
          await fetchCartFromApi();
          shouldUseLocalFallback = false;
        }
      } catch (err: any) {
        console.error("Failed to remove item via API, using local remove:", err);
        setError(prev => ({ 
          ...prev, 
          apiError: extractAxiosMessage(err) || "Failed to remove item from server" 
        }));
      }
    }

    // Remove from local cart only when API sync is unavailable/failed
    if (shouldUseLocalFallback) {
      setCart(prevCart => {
      const updatedStores = prevCart.stores.map(store => ({
        ...store,
        items: store.items.filter(item => item.id !== itemId),
      })).filter(store => store.items.length > 0); // Remove empty stores

      // Recalculate store totals
      const storesWithTotals = updatedStores.map(store => ({
        ...store,
        total: store.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }));

      const { totalItems, totalAmount } = calculateTotals(storesWithTotals);

      return {
        stores: storesWithTotals,
        totalItems,
        totalAmount,
        lastUpdated: new Date().toISOString(),
      };
      });
    }

    setLoading(prev => ({ ...prev, isUpdating: false }));
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    // Set updating state
    setLoading(prev => ({ ...prev, isUpdating: true }));
    clearErrors();

    let shouldUseLocalFallback = true;
    const token = getBringAmToken();

    // Try to update via API first if logged in (same rule as add-to-cart)
    if (token) {
      try {
        let storeProductUuid = null;
        for (const store of cart.stores) {
          const item = store.items.find(item => item.id === itemId);
          if (item) {
            storeProductUuid = resolveStoreProductUuidFromPayload(item);
            break;
          }
        }

        if (storeProductUuid) {
          const cartUuid = await ensureApiCartUuid();
          const updateRequest: AddToCartRequest = {
            storeProductUuid,
            quantity,
          };
          await addItemToCartApi(cartUuid, updateRequest);
          await fetchCartFromApi();
          shouldUseLocalFallback = false;
        }
      } catch (err: any) {
        console.error("Failed to update item via API, using local update:", err);
        setError(prev => ({ 
          ...prev, 
          apiError: extractAxiosMessage(err) || "Failed to update item on server" 
        }));
      }
    }

    // Update local cart only when API sync is unavailable/failed
    if (shouldUseLocalFallback) {
      setCart(prevCart => {
      const updatedStores = prevCart.stores.map(store => ({
        ...store,
        items: store.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      }));

      // Recalculate store totals
      const storesWithTotals = updatedStores.map(store => ({
        ...store,
        total: store.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }));

      const { totalItems, totalAmount } = calculateTotals(storesWithTotals);

      return {
        stores: storesWithTotals,
        totalItems,
        totalAmount,
        lastUpdated: new Date().toISOString(),
      };
      });
    }

    // Reset loading state
    setLoading(prev => ({ ...prev, isUpdating: false }));
  };

  const clearCart = async () => {
    // Set updating state
    setLoading(prev => ({ ...prev, isUpdating: true }));
    clearErrors();

    // Try to clear via API first if available
    if (hasApiConnection && apiCartData?.uuid) {
      try {
        await clearCartApi(apiCartData.uuid);
        await fetchCartFromApi();
      } catch (err: any) {
        console.error("Failed to clear cart via API, using local clear:", err);
        setError(prev => ({ 
          ...prev, 
          apiError: err.message || "Failed to clear cart on server" 
        }));
      }
    }

    // Clear local cart
    setCart({
      stores: [],
      totalItems: 0,
      totalAmount: 0,
      lastUpdated: new Date().toISOString(),
    });

    // Reset loading state
    setLoading(prev => ({ ...prev, isUpdating: false }));
  };

  const getItemCount = () => cart.totalItems;

  const getTotalAmount = () => cart.totalAmount;

  // ===== NEW API FUNCTIONS =====
  const fetchCartFromApi = async (): Promise<void> => {
    if (loading.isLoadingCart) return; // Prevent duplicate calls

    setLoading(prev => ({ ...prev, isLoadingCart: true }));
    clearErrors();

    try {
      const response = await getUserCartApi();
      
      if (response.success && response.data) {
        setApiCartData(response.data);
        setHasApiConnection(true);

        const apiCartItems = response.data.cartItems || [];

        if (apiCartItems.length > 0) {
          // Transform API data to local structure
          const apiCart = transformApiCartToLocal(apiCartItems);

          // Only replace local cart if the transformed items have valid IDs
          const hasValidItems = apiCart.stores.some((s) =>
            s.items.some((i) => Boolean(i.productId))
          );
          if (hasValidItems) {
            setCart(apiCart);
          }
        }
        // Never overwrite local cart with empty server cart.

      } else {
        throw new Error(response.message || "Failed to fetch cart");
      }
    } catch (err: any) {
      console.error("Error fetching cart from API:", err);
      setError(prev => ({ 
        ...prev, 
        apiError: extractAxiosMessage(err) || "Failed to fetch cart from server" 
      }));
      setHasApiConnection(false);
    } finally {
      setLoading(prev => ({ ...prev, isLoadingCart: false }));
    }
  };

  const syncCartWithApi = async (): Promise<void> => {
    if (loading.isSyncing) return; // Prevent duplicate calls

    setLoading(prev => ({ ...prev, isSyncing: true }));
    clearErrors();

    try {
      // For now, just fetch from API
      // In future phases, we'll add push/merge functionality
      await fetchCartFromApi();
    } catch (err: any) {
      console.error("Error syncing cart with API:", err);
      setError(prev => ({ 
        ...prev, 
        syncError: err.message || "Failed to synchronize cart" 
      }));
    } finally {
      setLoading(prev => ({ ...prev, isSyncing: false }));
    }
  };

  const resolveCartConflict = (resolution: 'use_local' | 'use_api' | 'merge'): void => {
    // For now, implement basic resolution strategies
    switch (resolution) {
      case 'use_local':
        // Keep current local cart, don't change anything
        break;
        
      case 'use_api':
        // This would be handled by fetchCartFromApi
        fetchCartFromApi();
        break;
        
      case 'merge':
        // Simple merge strategy for now (more complex logic in future phases)
        // This is a placeholder - more sophisticated merging in future phases
        break;
        
      default:
        // unknown strategy; noop
    }
  };

  return (
    <CartContext.Provider
      value={{
        // Cart Data
        cart,
        apiCartData,
        
        // Loading States  
        loading,
        
        // Error States
        error,
        
        // Cart Operations (Existing)
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotalAmount,
        
        // API Cart Operations (New)
        fetchCartFromApi,
        syncCartWithApi,
        resolveCartConflict,
        
        // Utility Properties
        isCartLoaded: isLoaded,
        hasApiConnection,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartProvider;
