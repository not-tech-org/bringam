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
import { motion } from "framer-motion";

// Animation variants for cart page
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

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
        <motion.div 
          className="bg-white min-h-screen"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="px-4"
            variants={itemVariants}
          >
            <Button 
              type="button"
              style="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              onClick={handleBackToStores}
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Stores
            </Button>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center justify-center py-20"
            variants={itemVariants}
          >
            <div className="text-center max-w-md">
              {/* Better illustration */}
              <motion.div 
                className="relative mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaShoppingBag className="h-12 w-12 text-gray-400" />
                </div>
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-semibold text-gray-900 mb-2"
                variants={itemVariants}
              >
                Your cart is empty
              </motion.h2>
              <motion.p 
                className="text-gray-600 mb-8"
                variants={itemVariants}
              >
                Looks like you haven't added any items to your cart yet.
              </motion.p>
              
              {/* Popular categories */}
              <motion.div 
                className="mb-8"
                variants={itemVariants}
              >
                <h3 className="text-sm font-medium text-gray-700 mb-4">Popular Categories</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Fashion', 'Electronics', 'Food & Dining', 'Health & Beauty'].map((category, index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Link href="/all">
                        <motion.span 
                          className="px-3 py-1 bg-gray-100 hover:bg-[#3c4948] hover:text-white text-gray-600 text-sm rounded-full transition-colors cursor-pointer block"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {category}
                        </motion.span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                className="flex justify-center"
                variants={itemVariants}
              >
                <Link href="/all">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="button" 
                      style="flex items-center justify-center gap-2"
                      primary
                    >
                      <FaShoppingBag className="h-4 w-4" />
                      Start Shopping
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <motion.div 
        className="bg-white min-h-screen"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="px-4"
          variants={itemVariants}
        >
          <Button 
            type="button"
            style="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            onClick={handleBackToStores}
          >
            <FaArrowLeft className="h-4 w-4" />
            Back to Stores
          </Button>

          <motion.div 
            className="flex items-center justify-between mb-6"
            variants={itemVariants}
          >
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="button"
                style="text-red-600 hover:text-red-700"
                onClick={() => setShowClearDialog(true)}
              >
                Clear Cart
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="space-y-6"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
          >
            {cart.stores.map((store, storeIndex) => (
              <motion.div 
                key={store.storeId} 
                className="bg-gray-50 rounded-lg p-4"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: storeIndex * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{store.storeName}</h3>
                  <span className="text-sm text-gray-600">{store.items.length} item(s)</span>
                </div>

                <div className="space-y-3">
                  {store.items.map((item, itemIndex) => (
                    <motion.div 
                      key={item.id} 
                      className="bg-white rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (storeIndex * 0.1) + (itemIndex * 0.05) }}
                      whileHover={{ y: -2 }}
                    >
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
                        <motion.button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                          disabled={updatingItems.has(item.id)}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaMinus className="h-3 w-3 text-gray-600" />
                        </motion.button>
                        <span className="w-8 text-center font-medium text-lg">
                          {updatingItems.has(item.id) ? '...' : item.quantity}
                        </span>
                        <motion.button
                          onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                          disabled={updatingItems.has(item.id)}
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaPlus className="h-3 w-3 text-gray-600" />
                        </motion.button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <motion.button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors mt-1 p-1 rounded-full hover:bg-red-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaTrash className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Store Total:</span>
                    <span className="font-semibold text-gray-900">{formatPrice(store.total)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-8 bg-gray-50 rounded-lg p-6"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total ({cart.totalItems} items):</span>
              <span className="text-2xl font-bold text-[#3c4948]">{formatPrice(cart.totalAmount)}</span>
            </div>
            
            <div className="flex gap-4">
              <Link href="/all" className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="button"
                    style="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-[#3c4948] hover:bg-[#3c4948] hover:text-white hover:border-[#3c4948] hover:shadow-lg transition-all duration-300 ease-out font-medium shadow-sm"
                  >
                    Continue Shopping
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="button"
                  style="flex-1 flex items-center justify-center gap-2"
                  primary
                >
                  Proceed to Checkout
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Clear Cart Confirmation Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-5 border-b border-red-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-full shadow-sm border border-red-200">
                    <FaTrash className="text-red-600 text-xl" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Clear Cart</h3>
                    <p className="text-sm text-red-700 font-medium">This action cannot be undone</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowClearDialog(false)}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <FaTimes className="text-red-500 text-lg" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="text-center mb-6">
                <p className="text-gray-700 leading-relaxed text-base">
                  Are you sure you want to remove all items from your cart? You'll need to add items again to continue shopping.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearDialog(false)}
                  className="flex-1 px-5 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 border border-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearCart}
                  disabled={isClearingCart}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  {isClearingCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Clearing...</span>
                    </>
                  ) : (
                    <>
                      <FaTrash className="text-base" />
                      <span>Clear Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default CartPage;
