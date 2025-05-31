"use client";

import Button from "@/app/components/common/Button";
import Wrapper from "@/app/components/wrapper/Wrapper";
import Image from "next/image";
import React, { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";

const ProductDetails = () => {
  const [selectedImage, setSelectedImage] = useState(0);

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
              <button className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors duration-200 text-sm font-medium">
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
                className="flex-1 py-3 text-sm font-medium bg-gray-800 hover:bg-gray-900"
              >
                Edit product
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ProductDetails;
