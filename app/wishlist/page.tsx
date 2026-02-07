"use client";

import React, { useState, useEffect, useCallback } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Image from "next/image";
import Button from "../components/common/Button";
import Preloader from "../components/common/Preloader";
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { getCustomerWishlistApi } from "../services/WishlistService";
import { WishlistItem } from "../types/wishlist";
import { showToast } from "../components/utils/helperFunctions";
import { motion } from "framer-motion";
import Link from "next/link";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
};

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomerWishlistApi({
        pageNo: 0,
        pageSize: 50, // Fetch more items for wishlist
        sortBy: "id",
        sortDir: "desc",
      });

      if (response.success && response.data) {
        setWishlistItems(response.data.content || []);
      } else {
        throw new Error(response.message || "Failed to fetch wishlist");
      }
    } catch (err: any) {
      console.error("Error fetching wishlist:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load wishlist. Please try again.";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveItem = async (itemUuid: string) => {
    // TODO: Implement remove from wishlist API call when endpoint is available
    setRemovingItems((prev) => new Set(prev).add(itemUuid));
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    setWishlistItems((prev) => prev.filter((item) => item.uuid !== itemUuid));
    setRemovingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemUuid);
      return newSet;
    });
    
    showToast("Item removed from wishlist", "success");
  };

  const handleAddToCart = (item: WishlistItem) => {
    // TODO: Implement add to cart functionality
    showToast("Add to cart functionality coming soon", "info");
  };

  const formatPrice = (price?: number) => {
    if (!price) return "Price not available";
    return `₦${price.toLocaleString()}`;
  };

  const getItemImage = (item: WishlistItem) => {
    return item.image || item.productImageUrl || "/images/placeholder.png";
  };

  const getItemName = (item: WishlistItem) => {
    return item.name || item.productName || "Unnamed Product";
  };

  const getItemPrice = (item: WishlistItem) => {
    return item.price || 0;
  };

  // Loading state
  if (loading) {
    return (
      <Wrapper>
        <div className="bg-white min-h-screen flex items-center justify-center">
          <Preloader height={60} />
        </div>
      </Wrapper>
    );
  }

  // Error state
  if (error && wishlistItems.length === 0) {
    return (
      <Wrapper>
        <motion.div
          className="bg-white min-h-screen"
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          <div className="px-4 py-8">
            <Button
              type="button"
              style="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
              onClick={() => window.location.reload()}
            >
              <FaArrowLeft className="h-4 w-4" />
              Go Back
            </Button>

            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <FaHeart className="h-12 w-12 text-red-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Unable to load wishlist
                </h2>
                <p className="text-gray-600 mb-8">{error}</p>
                <Button type="button" primary onClick={fetchWishlist}>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Wrapper>
    );
  }

  // Empty state
  if (wishlistItems.length === 0) {
    return (
      <Wrapper>
        <motion.div
          className="bg-white min-h-screen"
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          <div className="px-4 py-8">
            <Button
              type="button"
              style="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
              onClick={() => (window.location.href = "/all")}
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to Stores
            </Button>

            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center max-w-md">
                <motion.div
                  className="relative mb-6"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaHeart className="h-12 w-12 text-gray-400" />
                  </div>
                </motion.div>

                <motion.h2
                  className="text-2xl font-semibold text-gray-900 mb-2"
                  variants={itemVariants}
                >
                  Your wishlist is empty
                </motion.h2>
                <motion.p
                  className="text-gray-600 mb-8"
                  variants={itemVariants}
                >
                  Start adding items you love to your wishlist for easy access
                  later.
                </motion.p>

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
                        <FaShoppingCart className="h-4 w-4" />
                        Start Shopping
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </Wrapper>
    );
  }

  // Wishlist items display
  return (
    <Wrapper>
      <motion.div
        className="bg-white min-h-screen"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className="px-4 py-8">
          <motion.div
            className="flex items-center justify-between mb-6"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-sm text-gray-600 mt-1">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            <Link href="/all">
              <Button
                type="button"
                style="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={pageVariants}
            initial="initial"
            animate="animate"
          >
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.uuid || item.id || index}
                className="bg-white rounded-lg border hover:shadow-lg transition-shadow duration-200 flex flex-col relative"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                transition={{ delay: index * 0.05 }}
              >
                {/* Remove button */}
                <motion.button
                  onClick={() => handleRemoveItem(item.uuid || item.id || "")}
                  disabled={removingItems.has(item.uuid || item.id || "")}
                  className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTrash
                    className={`h-4 w-4 ${
                      removingItems.has(item.uuid || item.id || "")
                        ? "text-gray-400"
                        : "text-red-500"
                    }`}
                  />
                </motion.button>

                {/* Product Image */}
                <div className="relative h-48 w-full">
                  <Image
                    src={getItemImage(item)}
                    alt={getItemName(item)}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {getItemName(item)}
                  </h3>
                  {item.storeName && (
                    <p className="text-sm text-gray-500 mb-2">
                      {item.storeName}
                    </p>
                  )}
                  {item.category && (
                    <p className="text-xs text-gray-400 mb-3">{item.category}</p>
                  )}

                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-[#3c4948]">
                        {formatPrice(getItemPrice(item))}
                      </span>
                    </div>

                    <motion.button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2 px-4 bg-[#3c4948] text-white rounded-lg hover:bg-[#2a3a39] transition-colors flex items-center justify-center gap-2 font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </Wrapper>
  );
};

export default WishlistPage;
