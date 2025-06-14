"use client";

import Button from "@/app/components/common/Button";
import Wrapper from "@/app/components/wrapper/Wrapper";
import Image from "next/image";
import React, { useState } from "react";
import {
  IoTrashOutline,
  IoWarningOutline,
  IoCloudUploadOutline,
} from "react-icons/io5";
import { showToast } from "@/app/components/utils/helperFunctions";

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    productName: "Beats Headset",
    productDescription:
      "Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tempus urna at turpis condimentum lobortis.",
    chargePrice: "90000",
    costPrice: "75000",
    productWeight: "0.5",
    productLength: "20",
    height: "15",
    category: "Gadgets",
    quantityInStock: "4",
  });

  const productImages = [
    "/images/product-cover-5.png",
    "/images/product-cover-5.png",
    "/images/product-cover-5.png",
  ];

  const availableColors = [
    { name: "Beige", color: "#F5E6D3" },
    { name: "White", color: "#FFFFFF" },
    { name: "Black", color: "#000000" },
  ];

  const handleDeleteProduct = () => {
    // Handle product deletion logic here
    console.log("Product deleted");
    showToast("Product deleted successfully", "success");
    setShowDeleteModal(false);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // Handle product update logic here
    console.log("Product updated:", editFormData);
    showToast("Product updated successfully", "success");
    setShowEditModal(false);
  };

  return (
    <Wrapper>
      <div className="max-w-6xl p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Product details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Product Images */}
          <div className="space-y-4">
            {/* Main product image */}
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <Image
                src={productImages[selectedImage]}
                alt="Product image"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image thumbnails */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Images</h3>
              <div className="flex gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-gray-400"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Product ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Available colors */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">
                Available colors
              </h3>
              <div className="flex gap-3">
                {availableColors.map((color, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded border border-gray-300"
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Product Details */}
          <div className="space-y-6">
            {/* Delete button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors duration-200 text-sm font-medium"
              >
                <IoTrashOutline className="w-4 h-4" />
                Delete this product?
              </button>
            </div>

            {/* Product info grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Product name</label>
                  <p className="font-medium text-gray-900">Beats Headset</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Product code</label>
                  <p className="font-medium text-gray-900">#BA-340293</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Price</label>
                  <p className="font-medium text-gray-900">₦90,000</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Quantity</label>
                  <p className="font-medium text-gray-900">4 pcs</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Availability</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    In stock
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Korem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                vulputate libero et velit interdum, ac aliquet odio mattis.
                Class aptent taciti sociosqu ad litora torquent per conubia
                nostra, per inceptos himenaeos. Curabitur tempus urna at turpis
                condimentum lobortis.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                secondary
                className="flex-1 py-3 text-sm font-medium"
              >
                Close
              </Button>
              <Button
                type="button"
                primary
                onClick={() => setShowEditModal(true)}
                className="flex-1 py-3 text-sm font-medium bg-gray-800 hover:bg-gray-900"
              >
                Edit product
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Delete product
            </h2>

            {/* Product preview */}
            <div className="flex gap-4 mb-8">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/images/product-cover-5.png"
                  alt="Product"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Product name</span>
                    <p className="font-medium text-gray-900">Beats Headset</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Product code</span>
                    <p className="font-medium text-gray-900">#BA-340293</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Price</span>
                    <p className="font-medium text-gray-900">₦90,000</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Quantity</span>
                    <p className="font-medium text-gray-900">4 pcs</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Availability</span>
                    <p className="font-medium text-gray-900">In stock</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status</span>
                    <p className="font-medium text-gray-900">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning message */}
            <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg mb-8">
              <IoWarningOutline className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-orange-800 font-medium">
                  You are about to delete this product.
                </p>
                <p className="text-orange-700">
                  This product will be removed from your store.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                Delete product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 space-y-8">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Product
              </h2>

              {/* Product title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product title
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  This will be displayed as the name of your product.
                </p>
                <input
                  type="text"
                  name="productName"
                  value={editFormData.productName}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter text"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Describe your product. This can include &apos;size&apos;,
                  specs, colours etc&apos;.
                </p>
                <textarea
                  name="productDescription"
                  value={editFormData.productDescription}
                  onChange={handleEditInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                  placeholder="Enter text"
                />
              </div>

              {/* Price section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Price
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Charge price
                    </label>
                    <input
                      type="number"
                      name="chargePrice"
                      value={editFormData.chargePrice}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="₦0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">
                      Cost price
                    </label>
                    <input
                      type="number"
                      name="costPrice"
                      value={editFormData.costPrice}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="₦0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product weight
                  </label>
                  <input
                    type="number"
                    name="productWeight"
                    value={editFormData.productWeight}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product length
                  </label>
                  <input
                    type="number"
                    name="productLength"
                    value={editFormData.productLength}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={editFormData.height}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Choose a category for your product.
                </p>
                <div className="relative">
                  <select
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="Gadgets">Gadgets</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Food">Food & Beverages</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Quantity in stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity in stock
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  What is the quantity available?
                </p>
                <input
                  type="number"
                  name="quantityInStock"
                  value={editFormData.quantityInStock}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter text"
                />
              </div>

              {/* Add product images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add product images
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Upload images of your products
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
                  <IoCloudUploadOutline className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    <span className="text-blue-600 cursor-pointer">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Accepted file formats: .jpg, .png and .png
                    <br />
                    Add up to 10 files, 10mb size limit and 10240kb max.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="flex-1 px-6 py-4 text-white bg-gray-800 hover:bg-gray-900 rounded-lg font-medium transition-colors"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default ProductDetails;
