"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { FaStar } from "react-icons/fa";
import { showToast } from "../utils/helperFunctions";

interface ReviewFormProps {
  storeProductId: string;
  onSubmit: (data: {
    storeProductId: string;
    summary: string;
    comment: string;
    rating: number;
  }) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  storeProductId,
  onSubmit,
  onClose,
  loading,
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    summary: "",
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
    // Clear rating error
    if (errors.rating) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.rating;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please select a rating (1-5 stars)";
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Please enter a summary";
    } else if (formData.summary.trim().length < 3) {
      newErrors.summary = "Summary must be at least 3 characters";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Please enter a comment";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please correct the errors in the form", "error");
      return;
    }

    try {
      await onSubmit({
        storeProductId,
        summary: formData.summary.trim(),
        comment: formData.comment.trim(),
        rating: formData.rating,
      });
      // Form will be reset by parent closing the modal
    } catch (err) {
      // Error handled by parent component
      console.error("Submission error in form:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Write a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
                disabled={loading}
              >
                <FaStar
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoveredRating || formData.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            {formData.rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating} star{formData.rating !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Summary */}
        <div>
          <Input
            label="Summary"
            name="summary"
            type="text"
            value={formData.summary}
            onChange={handleInputChange}
            placeholder="Brief summary of your review"
            error={errors.summary}
            required
            disabled={loading}
          />
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Review Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Share your experience with this product..."
            rows={5}
            required
            disabled={loading}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
              errors.comment ? "border-red-500" : "border-gray-300"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{
              backgroundColor: loading ? "#E5E5E5" : "#F7F7F7",
            }}
          />
          {errors.comment && (
            <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Minimum 10 characters required
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            style="bg-gray-200 text-gray-800 hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" primary isLoading={loading}>
            Submit Review
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
