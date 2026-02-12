"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Wrapper from "../../components/wrapper/Wrapper";
import Image from "next/image";
import Button from "../../components/common/Button";
import Preloader from "../../components/common/Preloader";
import Modal from "../../components/common/Modal";
import ReviewForm from "../../components/reviews/ReviewForm";
import { FaArrowLeft, FaStar, FaShoppingCart, FaHeart, FaEdit } from "react-icons/fa";
import { getProductReviewsApi, addProductReviewApi } from "../../services/ReviewService";
import { ReviewItem } from "../../types/review";
import { showToast } from "../../components/utils/helperFunctions";
import { motion } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import { toggleWishlistItemApi } from "../../services/WishlistService";
import { getProductById } from "../../services/CustomerService";
import { SkeletonCard } from "../../components/common/Skeleton";

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
  
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Resolve product UUID for API calls
  const resolveProductUuid = (product: any): string | null => {
    return product?.uuid || product?.productUuid || product?.id || null;
  };

  // Resolve storeProductId for review API calls
  const resolveStoreProductId = (product: any): string | null => {
    // Try multiple possible field names (API might use different field names)
    return (
      product?.storeProductId ||
      product?.storeProductUuid ||
      product?.uuid ||
      product?.productUuid ||
      product?.id ||
      null
    );
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
      setError(null);
      try {
        const productResponse = await getProductById(productId);
        const productData = productResponse.data.data || productResponse.data;
        setProduct(productData);
        
        // Fetch reviews after product is loaded
        const productUuid = resolveProductUuid(productData);
        if (productUuid) {
          await fetchReviews(productUuid);
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load product. Please try again.";
        setError(errorMessage);
        setProduct(null);
      } finally {
        setLoading(false);
        setHasFetched(true);
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
        productId: product.id || product.uuid,
        storeProductUuid: product.storeProductUuid || product.uuid,
        storeId: product.storeId || product.store?.id || product.store?.uuid,
        storeName: product.storeName || product.store?.name,
        name: product.name || product.productName,
        price: product.price || 0,
        image: product.image || product.productImageUrl || product.imageUrl || "/images/placeholder.png",
        category: product.category || product.productCategory,
      });
      showToast("Item added to cart", "success");
    } catch (error) {
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

  const openReviewModal = () => setIsReviewModalOpen(true);
  const closeReviewModal = () => setIsReviewModalOpen(false);

  const handleSubmitReview = async (data: {
    storeProductId: string;
    summary: string;
    comment: string;
    rating: number;
  }) => {
    setSubmittingReview(true);
    try {
      const response = await addProductReviewApi(data);
      if (response.success) {
        showToast(
          response.message || "Review submitted successfully!",
          "success"
        );
        closeReviewModal();
        // Refresh reviews after successful submission
        const productUuid = resolveProductUuid(product);
        if (productUuid) {
          await fetchReviews(productUuid);
        }
      } else {
        throw new Error(response.message || "Failed to submit review");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit review. Please try again.";
      showToast(errorMessage, "error");
      throw err; // Re-throw to let form handle it
    } finally {
      setSubmittingReview(false);
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
        <div className="bg-white min-h-screen px-4 py-8 max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded-md w-24 mb-4 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded-md w-1/2 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded-md w-1/4 animate-pulse" />
              <div className="h-20 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  // Error state
  if (error && !product && hasFetched) {
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

  if (!product) return null;

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
                  src={product.image || product.productImageUrl || product.imageUrl || "/images/placeholder.png"}
                  alt={product.name || product.productName || "Product"}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name || product.productName || "Product"}
                </h1>
                <p className="text-sm text-gray-500 mb-4">{product.category || product.productCategory || "Uncategorized"}</p>
                {product.rating && (
                  <div className="mb-4">{renderStars(product.rating)}</div>
                )}
                <p className="text-3xl font-bold text-[#3c4948] mb-4">
                  {product.price ? formatPrice(product.price) : "Price not available"}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || product.productDescription || "No description available."}
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
              <div className="flex items-center gap-4">
                {reviews.length > 0 && (
                  <span className="text-sm text-gray-600">
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </span>
                )}
                <Button
                  type="button"
                  style="flex items-center gap-2"
                  primary
                  onClick={openReviewModal}
                >
                  <FaEdit className="h-4 w-4" />
                  Write a Review
                </Button>
              </div>
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

      {/* Review Form Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={closeReviewModal} closeIcon>
        <ReviewForm
          storeProductId={resolveStoreProductId(product) || ""}
          onSubmit={handleSubmitReview}
          onClose={closeReviewModal}
          loading={submittingReview}
        />
      </Modal>
    </Wrapper>
  );
};

export default ProductDetailPage;
