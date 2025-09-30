// Cart-related types and interfaces

export interface CartItem {
  id: string;
  productId: string;
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

export interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, 'id' | 'addedAt' | 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalAmount: () => number;
}
