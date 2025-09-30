"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Cart, CartItem, CartStore, CartContextType } from "../types/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = "bringam_cart";

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>({
    stores: [],
    totalItems: 0,
    totalAmount: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const isAddingRef = useRef(false);

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

  const calculateTotals = (stores: CartStore[]) => {
    const totalItems = stores.reduce((sum, store) => 
      sum + store.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const totalAmount = stores.reduce((sum, store) => sum + store.total, 0);
    return { totalItems, totalAmount };
  };

  const addToCart = (itemData: Omit<CartItem, 'id' | 'addedAt' | 'quantity'>) => {
    // Prevent double execution in React StrictMode
    if (isAddingRef.current) {
      return;
    }
    isAddingRef.current = true;

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

    // Reset the flag after a short delay
    setTimeout(() => {
      isAddingRef.current = false;
    }, 100);
  };

  const removeFromCart = (itemId: string) => {
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

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

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
  };

  const clearCart = () => {
    setCart({
      stores: [],
      totalItems: 0,
      totalAmount: 0,
      lastUpdated: new Date().toISOString(),
    });
  };

  const getItemCount = () => cart.totalItems;

  const getTotalAmount = () => cart.totalAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotalAmount,
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
