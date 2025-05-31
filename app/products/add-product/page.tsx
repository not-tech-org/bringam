"use client";

import React, { useState, useEffect } from "react";
import Wrapper from "@/app/components/wrapper/Wrapper";
import Input from "@/app/components/common/Input";
import TextArea from "@/app/components/common/TextArea";
import Upload from "@/app/components/common/Upload";
import Button from "@/app/components/common/Button";
import {
  getAllProductCategories,
  createProduct,
} from "@/app/services/AuthService";

export default function AddProductPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Product form states
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productCategory: "",
    productImage: "",
    productBrand: "",
    productSize: "",
    productMaterial: "",
    productWeightPerUnit: "",
    productSoldInPacks: false,
    productUnitsPerPack: 0,
    productWeightPerPack: "",
    productLength: "",
    productWidth: "",
    productHeight: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllProductCategories();
        console.log("Categories:", response.data);
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file upload
  const handleFileUpload = async (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);

    if (uploadedFiles.length > 0) {
      try {
        // Convert first image to base64 for the API
        const base64Image = await convertToBase64(uploadedFiles[0]);

        // Update form data with the base64 image
        setFormData((prev) => ({
          ...prev,
          productImage: base64Image,
        }));

        // Create preview URLs for all uploaded images
        const imageUrls = uploadedFiles.map((file) =>
          URL.createObjectURL(file)
        );
        setUploadedImages(imageUrls);

        console.log("Images uploaded successfully");
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    } else {
      // Clear images if no files
      setFormData((prev) => ({
        ...prev,
        productImage: "",
      }));
      setUploadedImages([]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newImageUrls = uploadedImages.filter((_, i) => i !== index);

    setFiles(newFiles);
    setUploadedImages(newImageUrls);

    // Update form data
    if (newFiles.length > 0) {
      convertToBase64(newFiles[0]).then((base64Image) => {
        setFormData((prev) => ({
          ...prev,
          productImage: base64Image,
        }));
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        productImage: "",
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Form Data:", formData);

      const response = await createProduct(formData);
      console.log("Product created successfully:", response.data);

      // Reset form after successful creation
      setFormData({
        productName: "",
        productDescription: "",
        productCategory: "",
        productImage: "",
        productBrand: "",
        productSize: "",
        productMaterial: "",
        productWeightPerUnit: "",
        productSoldInPacks: false,
        productUnitsPerPack: 0,
        productWeightPerPack: "",
        productLength: "",
        productWidth: "",
        productHeight: "",
      });
      setFiles([]);
      setUploadedImages([]);
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="max-w-3xl mt-[-50px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Product title"
            helperText="This will be displayed as the name of your product."
            placeholder="Enter text"
            name="productName"
            type="text"
            value={formData.productName}
            onChange={handleInputChange}
          />

          <TextArea
            label="Description"
            helperText="Describe your product. This can include 'size', specs, colours etc'."
            placeholder="Enter text"
            name="productDescription"
            value={formData.productDescription}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Product Brand"
              type="text"
              placeholder="Enter brand name"
              name="productBrand"
              value={formData.productBrand}
              onChange={handleInputChange}
            />
            <Input
              label="Product Size"
              type="text"
              placeholder="Enter size"
              name="productSize"
              value={formData.productSize}
              onChange={handleInputChange}
            />
          </div>

          <Input
            label="Product Material"
            type="text"
            placeholder="Enter material"
            name="productMaterial"
            value={formData.productMaterial}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Product weight per unit"
              type="text"
              placeholder="0.00"
              suffix="kg"
              name="productWeightPerUnit"
              value={formData.productWeightPerUnit}
              onChange={handleInputChange}
            />
            <Input
              label="Product length"
              type="text"
              placeholder="0.00"
              name="productLength"
              value={formData.productLength}
              onChange={handleInputChange}
            />
            <Input
              label="Product width"
              type="text"
              placeholder="0.00"
              name="productWidth"
              value={formData.productWidth}
              onChange={handleInputChange}
            />
          </div>

          <Input
            label="Product height"
            type="text"
            placeholder="0.00"
            name="productHeight"
            value={formData.productHeight}
            onChange={handleInputChange}
          />

          <div>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                name="productSoldInPacks"
                checked={formData.productSoldInPacks}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Product sold in packs
              </span>
            </label>

            {formData.productSoldInPacks && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Units per pack"
                  type="number"
                  placeholder="0"
                  name="productUnitsPerPack"
                  value={formData.productUnitsPerPack.toString()}
                  onChange={handleInputChange}
                />
                <Input
                  label="Weight per pack"
                  type="text"
                  placeholder="0.00"
                  suffix="kg"
                  name="productWeightPerPack"
                  value={formData.productWeightPerPack}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Choose a category for your product.
            </p>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-[#2B3B2B] focus:ring-1 focus:ring-[#2B3B2B]"
              name="productCategory"
              value={formData.productCategory}
              onChange={handleInputChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add product images
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Upload images of your products
            </p>
            <Upload
              onChange={handleFileUpload}
              maxFiles={10}
              maxSize={10 * 1024 * 1024} // 10MB
            />

            {/* Display uploaded images */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Images ({uploadedImages.length})
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button type="submit" primary className="w-full" disabled={loading}>
              {loading ? "Creating Product..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}
