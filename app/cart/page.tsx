"use client";

import React, { useState } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Image from "next/image";
import Button from "../components/common/Button";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showToast } from "../components/utils/helperFunctions";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalAmount } = useCart();
  const router = useRouter();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearingCart, setIsClearingCart] = useState(false);

  const handleBackToStores = () => {
    router.push('/all');
  };

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    updateQuantity(itemId, newQuantity);
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    
    showToast("Quantity updated successfully!", "success");
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    showToast("Item removed from cart", "success");
  };

  const handleClearCart = async () => {
    setIsClearingCart(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    clearCart();
    setShowClearDialog(false);
    setIsClearingCart(false);
    showToast("Cart cleared successfully!", "success");
  };

  const formatPrice = (price: number) => {
    return `N${price.toLocaleString()}`;
  };

  if (cart.stores.length === 0) {
    return (
      <Wrapper>
        <div className="bg-white min-h-screen">
          <div className="px-4">
            <Button 
              type="button"
              style="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              onClick={handleBackToStores}
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Stores
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              {/* Better illustration */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
              
              {/* Popular categories */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Popular Categories</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Fashion', 'Electronics', 'Food & Dining', 'Health & Beauty'].map((category) => (
                    <Link key={category} href="/all">
                      <span className="px-3 py-1 bg-gray-100 hover:bg-[#3c4948] hover:text-white text-gray-600 text-sm rounded-full transition-colors cursor-pointer">
                        {category}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link href="/all">
                  <Button 
                    type="button" 
                    style="flex items-center justify-center gap-2"
                    primary
                  >
                    <FaShoppingBag className="h-4 w-4" />
                    Start Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="bg-white min-h-screen">
        <div className="px-4">
          <Button 
            type="button"
            style="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            onClick={handleBackToStores}
          >
            <FaArrowLeft className="h-4 w-4" />
            Back to Stores
          </Button>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <Button 
              type="button"
              style="text-red-600 hover:text-red-700"
              onClick={() => setShowClearDialog(true)}
            >
              Clear Cart
            </Button>
          </div>

          <div className="space-y-6">
            {cart.stores.map((store) => (
              <div key={store.storeId} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{store.storeName}</h3>
                  <span className="text-sm text-gray-600">{store.items.length} item(s)</span>
                </div>

                <div className="space-y-3">
                  {store.items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <p className="font-semibold text-[#3c4948]">{formatPrice(item.price)}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                          disabled={updatingItems.has(item.id)}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaMinus className="h-3 w-3 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-medium text-lg">
                          {updatingItems.has(item.id) ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          disabled={updatingItems.has(item.id)}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaPlus className="h-3 w-3 text-gray-600" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors mt-1 p-1 rounded-full hover:bg-red-50"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Store Total:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(store.total)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total ({cart.totalItems} items):</span>
              <span className="text-2xl font-bold text-[#3c4948]">{formatPrice(cart.totalAmount)}</span>
            </div>
            
            <div className="flex gap-4">
              <Link href="/all" className="flex-1">
                <Button 
                  type="button"
                  style="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-[#3c4948] hover:bg-[#3c4948] hover:text-white hover:border-[#3c4948] hover:scale-[1.02] hover:shadow-lg transition-all duration-300 ease-out font-medium shadow-sm"
                >
                  Continue Shopping
                </Button>
              </Link>
              <Button 
                type="button"
                style="flex-1 flex items-center justify-center gap-2"
                primary
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <FaTrash className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Clear Cart</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all items from your cart? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <Button
                type="button"
                style="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => setShowClearDialog(false)}
                disabled={isClearingCart}
              >
                <FaTimes className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="button"
                style="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleClearCart}
                disabled={isClearingCart}
                isLoading={isClearingCart}
              >
                <FaCheck className="h-4 w-4" />
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default CartPage;
