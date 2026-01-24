"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { 
  Cart, 
  CartItem, 
  CartStore, 
  CartContextType, 
  ApiCartData,
  ApiCartItem,
  CartLoadingState,
  CartErrorState,
  CartSyncConflict,
  CartOperationResult
} from "../types/cart";
import { getUserCartApi, addItemToCartApi, removeCartItemApi, AddToCartRequest } from "../services/CartService";

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = "bringam_cart";

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // ===== EXISTING STATE =====
  const [cart, setCart] = useState<Cart>({
    stores: [],
    totalItems: 0,
    totalAmount: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const isAddingRef = useRef(false);

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
  // Fetch cart from API after local cart is loaded
  useEffect(() => {
    if (isLoaded && !hasApiConnection) {
      // Try to fetch cart from API, but don't block if it fails
      fetchCartFromApi().catch(() => {
        // Silent fail - user can still use local cart
        console.log("API cart fetch failed, using local cart");
      });
    }
  }, [isLoaded, hasApiConnection]);

  // ===== UTILITY FUNCTIONS =====
  const calculateTotals = (stores: CartStore[]) => {
    const totalItems = stores.reduce((sum, store) => 
      sum + store.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const totalAmount = stores.reduce((sum, store) => sum + store.total, 0);
    return { totalItems, totalAmount };
  };

  // Transform API cart items to local cart structure
  const transformApiCartToLocal = (apiItems: ApiCartItem[]): Cart => {
    const storeMap = new Map<string, CartStore>();

    apiItems.forEach(apiItem => {
      const localItem: CartItem = {
        id: apiItem.id || `${apiItem.productId}-${Date.now()}`,
        productId: apiItem.productId,
        storeProductUuid: apiItem.productId,
        storeId: apiItem.storeId,
        storeName: apiItem.storeName,
        name: apiItem.name,
        price: apiItem.price,
        image: apiItem.image,
        quantity: apiItem.quantity,
        category: apiItem.category,
        addedAt: apiItem.addedAt || new Date().toISOString(),
      };

      if (storeMap.has(apiItem.storeId)) {
        const store = storeMap.get(apiItem.storeId)!;
        store.items.push(localItem);
        store.total += apiItem.price * apiItem.quantity;
      } else {
        storeMap.set(apiItem.storeId, {
          storeId: apiItem.storeId,
          storeName: apiItem.storeName,
          items: [localItem],
          total: apiItem.price * apiItem.quantity,
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

  const resolveStoreProductUuid = (item: { productId?: string; storeProductUuid?: string }) => {
    return item.storeProductUuid || item.productId || null;
  };

  const ensureApiCartUuid = async (): Promise<string | null> => {
    if (apiCartData?.uuid) {
      return apiCartData.uuid;
    }

    try {
      const response = await getUserCartApi();
      if (response.success && response.data) {
        setApiCartData(response.data);
        setHasApiConnection(true);
        const apiCart = transformApiCartToLocal(response.data.cartItems);
        setCart(apiCart);
        return response.data.uuid;
      }
    } catch (err: any) {
      setError(prev => ({
        ...prev,
        apiError: err.message || "Failed to fetch cart from server",
      }));
      setHasApiConnection(false);
    }

    return null;
  };

  const addToCart = async (itemData: Omit<CartItem, 'id' | 'addedAt' | 'quantity'>) => {
    // Prevent double execution in React StrictMode
    if (isAddingRef.current) {
      return;
    }
    isAddingRef.current = true;

    // Set updating state
    setLoading(prev => ({ ...prev, isUpdating: true }));
    clearErrors();

    const storeProductUuid = resolveStoreProductUuid(itemData);

    // Try to add via API first if available
    if (storeProductUuid) {
      try {
        const cartUuid = await ensureApiCartUuid();
        if (cartUuid) {
          const addRequest: AddToCartRequest = {
            storeProductUuid,
            quantity: 1,
          };
          await addItemToCartApi(cartUuid, addRequest);
        }
        console.log("Item successfully added to cart via API");

        // Refresh cart from API to get updated data
        await fetchCartFromApi();
      } catch (err: any) {
        console.error("Failed to add item via API, falling back to local:", err);
        setError(prev => ({ 
          ...prev, 
          apiError: err.message || "Failed to add item to server cart" 
        }));
        // Don't return here - fall back to local addition
      }
    }

    // Update local cart (either as fallback or in addition to API)
    setCart(prevCart => {
      // First, check if the exact product already exists in any store
      let existingItem: CartItem | undefined;
      let existingStoreIndex = -1;
      let existingItemIndex = -1;

      // Search through all stores for the product
      prevCart.stores.forEach((store, storeIdx) => {
        const itemIdx = store.items.findIndex(item => item.productId === itemData.productId);
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

        // Update store total
        updatedStores[existingStoreIndex].total = updatedStores[existingStoreIndex].items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );
      } else {
        // Product doesn't exist, find or create store
        const storeIndex = prevCart.stores.findIndex(store => store.storeId === itemData.storeId);

        const newItem: CartItem = {
          ...itemData,
          id: `${itemData.productId}-${Date.now()}`,
          storeProductUuid,
          quantity: 1,
          addedAt: new Date().toISOString(),
        };

        if (storeIndex >= 0) {
          // Store exists, add new item
          updatedStores = [...prevCart.stores];
          updatedStores[storeIndex] = {
            ...updatedStores[storeIndex],
            items: [...updatedStores[storeIndex].items, newItem],
            total: updatedStores[storeIndex].total + itemData.price,
          };
        } else {
          // Create new store with item
          const newStore: CartStore = {
            storeId: itemData.storeId,
            storeName: itemData.storeName,
            items: [newItem],
            total: itemData.price,
          };
          updatedStores = [...prevCart.stores, newStore];
        }
      }

      const { totalItems, totalAmount } = calculateTotals(updatedStores);

      return {
        stores: updatedStores,
        totalItems,
        totalAmount,
        lastUpdated: new Date().toISOString(),
      };
    });

    // Reset loading state and flag
    setLoading(prev => ({ ...prev, isUpdating: false }));
    
    // Reset the flag after a short delay
    setTimeout(() => {
      isAddingRef.current = false;
    }, 100);
  };

  const removeFromCart = async (itemId: string) => {
    // Set updating state
    setLoading(prev => ({ ...prev, isUpdating: true }));
    clearErrors();

    // Try to remove via API first if available
    if (hasApiConnection) {
      try {
        // Find the item to get its productId for the API call
        let storeProductUuid = null;
        for (const store of cart.stores) {
          const item = store.items.find(item => item.id === itemId);
          if (item) {
            storeProductUuid = resolveStoreProductUuid(item);
            break;
          }
        }

        if (storeProductUuid) {
          const cartUuid = await ensureApiCartUuid();
          if (cartUuid) {
            await removeCartItemApi(cartUuid, storeProductUuid);
          }
          console.log("Item successfully removed from cart via API");

          // Refresh cart from API to get updated data
          await fetchCartFromApi();
        } else {
          console.warn("Could not find item to remove via API, using local remove only");
        }
      } catch (err: any) {
        console.error("Failed to remove item via API, using local remove:", err);
        setError(prev => ({ 
          ...prev, 
          apiError: err.message || "Failed to remove item from server" 
        }));
      }
    }

    // Remove from local cart
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
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    // Set updating state
    setLoading(prev => ({ ...prev, isUpdating: true }));
    clearErrors();

    // Try to update via API first if available
    if (hasApiConnection) {
      try {
        let storeProductUuid = null;
        for (const store of cart.stores) {
          const item = store.items.find(item => item.id === itemId);
          if (item) {
            storeProductUuid = resolveStoreProductUuid(item);
            break;
          }
        }

        if (storeProductUuid) {
          const cartUuid = await ensureApiCartUuid();
          if (cartUuid) {
            const updateRequest: AddToCartRequest = {
              storeProductUuid,
              quantity,
            };
            await addItemToCartApi(cartUuid, updateRequest);
          }
          console.log("Item quantity updated via API");

          // Refresh cart from API to get updated data
          await fetchCartFromApi();
        }
      } catch (err: any) {
        console.error("Failed to update item via API, using local update:", err);
        setError(prev => ({ 
          ...prev, 
          apiError: err.message || "Failed to update item on server" 
        }));
      }
    }

    // Update local cart
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
        // TODO: Implement when clear endpoint is available
        // await clearCartApi(apiCartData.uuid);
        console.log("API clear not yet implemented, using local clear only");
        
        // After API success, refresh cart from API
        // await fetchCartFromApi();
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

        // Transform API data to local structure
        const apiCart = transformApiCartToLocal(response.data.cartItems);

        // Update local cart with API data
        setCart(apiCart);

        console.log("Cart successfully fetched from API");
      } else {
        throw new Error(response.message || "Failed to fetch cart");
      }
    } catch (err: any) {
      console.error("Error fetching cart from API:", err);
      setError(prev => ({ 
        ...prev, 
        apiError: err.message || "Failed to fetch cart from server" 
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
      console.log("Cart synchronized with API");
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
        console.log("Resolved conflict: Using local cart");
        break;
        
      case 'use_api':
        // This would be handled by fetchCartFromApi
        fetchCartFromApi();
        console.log("Resolved conflict: Using API cart");
        break;
        
      case 'merge':
        // Simple merge strategy for now (more complex logic in future phases)
        console.log("Resolved conflict: Merging carts (basic implementation)");
        // This is a placeholder - more sophisticated merging in future phases
        break;
        
      default:
        console.warn("Unknown conflict resolution strategy:", resolution);
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
