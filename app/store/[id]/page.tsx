"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Wrapper from "../../components/wrapper/Wrapper";
import Image from "next/image";
import Button from "../../components/common/Button";
import { FaArrowLeft, FaPhone, FaMapMarkerAlt, FaClock, FaStar, FaHeart, FaShare, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";
import { toggleWishlistItemApi } from "../../services/WishlistService";
import { showToast } from "../../components/utils/helperFunctions";
import { motion } from "framer-motion";

// Mock data - will be replaced with API integration later
const mockStoreData = {
  id: "1",
  name: "Fashion Hub",
  description: "Premium Fashion Store offering the latest trends and styles",
  category: "Fashion",
  rating: 4.8,
  totalRatings: 128,
  isOpen: true,
  openTime: "9:00 AM - 9:00 PM",
  phoneNumber: "+234 801 234 5678",
  email: "info@fashionhub.com",
  website: "www.fashionhub.com",
  address: {
    street: "123 Fashion Street",
    city: "Lagos",
    state: "Lagos State",
    landmark: "Near Victoria Island Mall"
  },
  coverPhotoUrl: "/images/stores/fashion-store-cover.jpg",
  profilePhotoUrl: "/images/stores/fashion-store.jpg",
  active: true,
  products: [
    {
      id: "1",
      name: "Designer Dress",
      price: "N25,000",
      image: "/images/products/dress1.jpg",
      category: "Dresses"
    },
    {
      id: "2", 
      name: "Casual Shirt",
      price: "N8,500",
      image: "/images/products/shirt1.jpg",
      category: "Shirts"
    },
    {
      id: "3",
      name: "Formal Pants",
      price: "N15,000", 
      image: "/images/products/pants1.jpg",
      category: "Pants"
    },
    {
      id: "4",
      name: "Summer Dress",
      price: "N12,000",
      image: "/images/products/dress2.jpg", 
      category: "Dresses"
    }
  ]
};

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0
  }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1
  }
};

const productVariants = {
  initial: { 
    opacity: 0, 
    y: 15,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  hover: {
    y: -2,
    scale: 1.02
  }
};

const StorePage = () => {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const storeId = params.id as string;
  const [addingToWishlist, setAddingToWishlist] = useState<Set<string>>(new Set());
  
  // For now, we'll use mock data. Later this will be replaced with API call
  const store = mockStoreData;

  const handleBackToStores = () => {
    router.push('/all');
  };

  const handleAddToCart = (product: any) => {
    try {
      // Improved price parsing with error handling
      const priceString = product.price.toString();
      const numericPrice = parseFloat(priceString.replace(/[^\d.]/g, ''));
      
      if (isNaN(numericPrice) || numericPrice <= 0) {
        console.error('Invalid price format:', product.price);
        return;
      }

      addToCart({
        productId: product.id,
        storeId: store.id,
        storeName: store.name,
        name: product.name,
        price: numericPrice,
        image: product.image,
        category: product.category,
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // Helper to resolve storeProductUuid from product
  const resolveStoreProductUuid = (product: any): string | null => {
    // Try multiple possible field names (API might use different field names)
    return (
      product.storeProductUuid ||
      product.uuid ||
      product.productUuid ||
      product.id ||
      null
    );
  };

  const handleToggleWishlist = async (product: any) => {
    const storeProductUuid = resolveStoreProductUuid(product);
    const productId = product.id || product.uuid || "";

    if (!storeProductUuid) {
      showToast("Unable to add to wishlist: missing product identifier", "error");
      return;
    }

    setAddingToWishlist((prev) => new Set(prev).add(productId));

    try {
      const response = await toggleWishlistItemApi(storeProductUuid);

      if (response.success) {
        // Determine if item was added or removed based on message or API response
        // For now, we'll show a generic success message
        const message = response.message || "Item added to wishlist";
        const isAdded = message.toLowerCase().includes("add") || 
                       message.toLowerCase().includes("success");
        
        showToast(
          isAdded ? "Item added to wishlist" : "Item removed from wishlist",
          "success"
        );
      } else {
        throw new Error(response.message || "Failed to update wishlist");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update wishlist. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setAddingToWishlist((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  return (
    <Wrapper>
      <motion.div 
        className="bg-white min-h-screen"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        transition={{ type: "spring", duration: 0.5 }}
      >
        {/* Back Button */}
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

        {/* Store Header */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Cover Photo */}
          <div className="relative h-64 w-full">
            <Image
              src={store.coverPhotoUrl || "/images/placeholder-cover.jpg"}
              alt={`${store.name} cover`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          </div>

          {/* Store Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Semi-transparent card background */}
            <div className="bg-black/20 backdrop-blur-md rounded-t-2xl p-6 -mx-6 -mb-6">
              <div className="flex items-end gap-4">
                {/* Store Logo */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src={store.profilePhotoUrl || "/images/placeholder.png"}
                    alt={`${store.name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Store Details */}
                <div className="flex-1 text-white">
                  <h1 className="text-2xl font-bold mb-1 drop-shadow-xl">{store.name}</h1>
                  <p className="text-sm opacity-95 mb-3 drop-shadow-lg">{store.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      <FaStar className="h-4 w-4 text-yellow-400" />
                      <span className="font-semibold">{store.rating}</span>
                      <span className="opacity-90">({store.totalRatings} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl border border-white/20 ${
                        store.isOpen ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
                      }`}>
                        {store.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors shadow-xl border border-white/20">
                    <FaHeart className="h-5 w-5 text-white" />
                  </button>
                  <button className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors shadow-xl border border-white/20">
                    <FaShare className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Store Information */}
        <motion.div 
          className="p-6 space-y-6"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Contact & Hours */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={cardVariants}
          >
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Store Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaClock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{store.openTime}</p>
                    <p className="text-xs text-gray-500">Store Hours</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaPhone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{store.phoneNumber}</p>
                    <p className="text-xs text-gray-500">Phone</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{store.address.street}</p>
                    <p className="text-xs text-gray-500">{store.address.city}, {store.address.state}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#3c4948] rounded-lg flex items-center justify-center">
                  <FaPhone className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button"
                  style="flex-1 flex items-center justify-center gap-2"
                  primary
                >
                  <FaPhone className="h-4 w-4" />
                  Call Store
                </Button>
                
                <Button 
                  type="button"
                  style="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 text-[#3c4948] hover:bg-[#3c4948] hover:text-white hover:border-[#3c4948] hover:scale-[1.02] hover:shadow-lg transition-all duration-300 ease-out font-medium shadow-sm"
                >
                  <FaMapMarkerAlt className="h-4 w-4" />
                  Get Directions
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Featured Products */}
          <motion.div variants={cardVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Featured Products</h2>
              <Button 
                type="button" 
                style="text-[#3c4948] hover:text-[#2a3a39] font-medium"
              >
                View All Products
              </Button>
            </div>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              transition={{ type: "spring", duration: 0.5 }}
            >
              {store.products.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="bg-white rounded-lg border hover:shadow-md transition-shadow relative"
                  variants={productVariants}
                  whileHover="hover"
                >
                  {/* Wishlist button */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWishlist(product);
                    }}
                    disabled={addingToWishlist.has(product.id || "")}
                    className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaHeart
                      className={`h-4 w-4 ${
                        addingToWishlist.has(product.id || "")
                          ? "text-gray-400"
                          : "text-red-500"
                      }`}
                    />
                  </motion.button>

                  <Link href={`/product/${product.id}`}>
                    <div className="cursor-pointer">
                      <div className="relative h-32 w-full">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className=" rounded-t-lg"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm text-gray-900 truncate hover:text-[#3c4948] transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="font-semibold text-blue-600 mt-1">{product.price}</p>
                      </div>
                    </div>
                  </Link>
                  <div className="p-3 pt-0">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      <Button 
                        type="button"
                        style="w-full mt-2 flex items-center justify-center gap-2"
                        primary
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaShoppingCart className="h-3 w-3" />
                        Add to Cart
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </Wrapper>
  );
};

export default StorePage;
