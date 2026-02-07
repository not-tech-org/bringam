"use client";

import React, { useState, useEffect } from "react";
import Button from "../../common/Button";
import Input from "../../common/Input";
import { getAllProducts } from "../../../services/AuthService";
import { showToast } from "../../utils/helperFunctions";

interface Product {
  uuid: string;
  productName: string;
  productDescription: string;
  productCategory: string;
  productBrand: string;
}

interface AddProductToStoreProps {
  storeUuid: string;
  handleSubmit: (data: {
    productUuid: string;
    storeUuid: string;
    quantity: number;
    price: number;
  }) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

const AddProductToStore: React.FC<AddProductToStoreProps> = ({
  storeUuid,
  handleSubmit,
  onClose,
  loading,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [formData, setFormData] = useState({
    productUuid: "",
    quantity: 1,
    price: 0,
  });

  const { productUuid, quantity, price } = formData;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await getAllProducts();
      console.log("Products API response:", response.data);
      
      // Safely extract products array with multiple fallbacks
      const productData = response?.data?.data || response?.data || [];
      const productsArray = Array.isArray(productData) ? productData : [];
      
      console.log("Processed products array:", productsArray);
      setProducts(productsArray);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // Ensure products is always an array
      showToast("Failed to load products", "error");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'quantity' ? Number(value) || 1 : 
               field === 'price' ? Number(value) || 0 : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productUuid) {
      showToast("Please select a product", "error");
      return;
    }
    
    if (!quantity || quantity <= 0) {
      showToast("Please enter a valid quantity", "error");
      return;
    }
    
    if (!price || price <= 0) {
      showToast("Please enter a valid price", "error");
      return;
    }

    try {
      await handleSubmit({
        productUuid,
        storeUuid,
        quantity,
        price,
      });
      
      // Reset form
      setFormData({
        productUuid: "",
        quantity: 1,
        price: 0,
      });
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Add Product to Store</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Product Selection */}
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
            Select Product
          </label>
          {loadingProducts ? (
            <div className="p-3 text-sm text-gray-500">Loading products...</div>
          ) : (
            <select
              id="product"
              value={productUuid}
              onChange={(e) => handleInputChange('productUuid', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="">Choose a product</option>
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <option key={product.uuid} value={product.uuid}>
                    {product.productName} - {product.productBrand} ({product.productCategory})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {loadingProducts ? "Loading..." : "No products available"}
                </option>
              )}
            </select>
          )}
        </div>

        {/* Quantity */}
        <div>
          <Input
            label="Quantity"
            type="number"
            id="quantity"
            value={quantity.toString()}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="Enter quantity"
            required
            min="1"
            disabled={loading}
          />
        </div>

        {/* Price */}
        <div>
          <Input
            label="Price (₦)"
            type="number"
            id="price"
            value={price.toString()}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="Enter price"
            required
            min="0"
            step="0.01"
            disabled={loading}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button 
            type="button" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            primary 
            loading={loading}
            disabled={loading || loadingProducts}
          >
            {loading ? "Adding..." : "Add to Store"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductToStore;