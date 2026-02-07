"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Wrapper from "../../components/wrapper/Wrapper";
import Image from "next/image";
import Button from "../../components/common/Button";
import Preloader from "../../components/common/Preloader";
import { FaArrowLeft, FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import { getProductReviewsApi } from "../../services/ReviewService";
import { ReviewItem } from "../../types/review";
import { showToast } from "../../components/utils/helperFunctions";
import { motion } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import { toggleWishlistItemApi } from "../../services/WishlistService";

// Mock product data - will be replaced with API integration later
const mockProductData = {
  id: "1",
  uuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "Designer Dress",
  description: "Premium quality designer dress with elegant design and comfortable fit.",
  price: 25000,
  image: "/images/products/dress1.jpg",
  category: "Dresses",
  storeId: "1",
  storeName: "Fashion Hub",
  rating: 4.5,
  totalReviews: 12,
};

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

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(mockProductData);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  // Resolve product UUID for API calls
  const resolveProductUuid = (product: any): string | null => {
    return product?.uuid || product?.productUuid || product?.id || null;
  };

  // Fetch product reviews
  const fetchReviews = useCallback(async (productUuid: string) => {
    setReviewsLoading(true);
    try {
      const response = await getProductReviewsApi(productUuid, {
        pageNo: 0,
        pageSize: 20,
        sortBy: "id",
        sortDir: "desc",
        statuses: "ACTIVE,INACTIVE",
      });

      if (response.success && response.data) {
        setReviews(response.data.content || []);
      } else {
        throw new Error(response.message || "Failed to fetch reviews");
      }
    } catch (err: any) {
      console.error("Error fetching reviews:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load reviews. Please try again.";
      setError(errorMessage);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  // Fetch product data and reviews
  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual product API call
        // const productResponse = await getProductById(productId);
        // setProduct(productResponse.data);
        
        // For now, use mock data
        setProduct(mockProductData);
        
        // Fetch reviews after product is loaded
        const productUuid = resolveProductUuid(mockProductData);
        if (productUuid) {
          await fetchReviews(productUuid);
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProductData();
    }
  }, [productId, fetchReviews]);

  const handleBack = () => {
    router.back();
  };

  const handleAddToCart = () => {
    try {
      addToCart({
        productId: product.id,
        storeId: product.storeId,
        storeName: product.storeName,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
      showToast("Item added to cart", "success");
    } catch (error) {
      console.error("Error adding item to cart:", error);
      showToast("Failed to add item to cart", "error");
    }
  };

  const handleToggleWishlist = async () => {
    const storeProductUuid = resolveProductUuid(product);
    if (!storeProductUuid) {
      showToast("Unable to add to wishlist: missing product identifier", "error");
      return;
    }

    setAddingToWishlist(true);
    try {
      const response = await toggleWishlistItemApi(storeProductUuid);
      if (response.success) {
        showToast("Item added to wishlist", "success");
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
      setAddingToWishlist(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`h-4 w-4 ${
              index < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : index === fullStars && hasHalfStar
                ? "text-yellow-400 fill-yellow-400 opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating})</span>
      </div>
    );
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
  if (error && !product) {
    return (
      <Wrapper>
        <div className="bg-white min-h-screen px-4 py-8">
          <Button
            type="button"
            style="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            onClick={handleBack}
          >
            <FaArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Unable to load product
              </h2>
              <p className="text-gray-600 mb-8">{error}</p>
              <Button type="button" primary onClick={handleBack}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  const productUuid = resolveProductUuid(product);

  return (
    <Wrapper>
      <motion.div
        className="bg-white min-h-screen"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <div className="px-4 py-8 max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="button"
              style="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
              onClick={handleBack}
            >
              <FaArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </motion.div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <motion.div variants={itemVariants} className="relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.image || "/images/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                {product.rating && (
                  <div className="mb-4">{renderStars(product.rating)}</div>
                )}
                <p className="text-3xl font-bold text-[#3c4948] mb-4">
                  {formatPrice(product.price)}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  style="flex-1 flex items-center justify-center gap-2"
                  primary
                  onClick={handleAddToCart}
                >
                  <FaShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <motion.button
                  onClick={handleToggleWishlist}
                  disabled={addingToWishlist}
                  className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaHeart
                    className={`h-5 w-5 ${
                      addingToWishlist ? "text-gray-400" : "text-red-500"
                    }`}
                  />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Reviews Section */}
          <motion.div variants={itemVariants} className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Reviews
              </h2>
              {reviews.length > 0 && (
                <span className="text-sm text-gray-600">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Reviews Loading State */}
            {reviewsLoading && (
              <div className="flex items-center justify-center py-12">
                <Preloader height={40} />
              </div>
            )}

            {/* Reviews Error State */}
            {!reviewsLoading && error && reviews.length === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-800 mb-4">{error}</p>
                <Button
                  type="button"
                  primary
                  onClick={() => productUuid && fetchReviews(productUuid)}
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Reviews Empty State */}
            {!reviewsLoading && !error && reviews.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <FaStar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-600">
                  Be the first to review this product!
                </p>
              </div>
            )}

            {/* Reviews List */}
            {!reviewsLoading && reviews.length > 0 && (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.uuid || review.id || index}
                    className="bg-white border border-gray-200 rounded-lg p-6"
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {review.customerName || "Anonymous"}
                          </h4>
                          {review.rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(review.rating || 0)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        {review.createdAt && (
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {review.status && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            review.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {review.status}
                        </span>
                      )}
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </Wrapper>
  );
};

export default ProductDetailPage;
