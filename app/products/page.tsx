"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Column, Table } from "@/app/components/common/Table";
import Wrapper from "@/app/components/wrapper/Wrapper";
import { IoSearch } from "react-icons/io5";
import Pagination from "@/app/components/common/Pagination";
import Button from "../components/common/Button";
import Link from "next/link";
import { getAllProducts } from "../services/AuthService";
import { showToast } from "@/app/components/utils/helperFunctions";
import ProductOverviewCard, { getOverviewCards } from "../components/products/ProductOverviewCard";

interface Product {
  uuid: string;
  productName: string;
  vendorUuid: string;
  productImageUrl: string;
}

interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    salesOverview: number;
    productsInStock: number;
    activeProducts: number;
    productViews: number;
    totalProductsSold: number;
    products: {
      content: Product[];
      pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
          sorted: boolean;
          empty: boolean;
          unsorted: boolean;
        };
      };
      totalPages: number;
      totalElements: number;
      size: number;
      number: number;
    };
  };
}

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [productsData, setProductsData] = useState<ProductsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      console.log("Products:", response.data);
      if (response.data.success) {
        setProductsData(response.data.data);
      } else {
        showToast(response.data.message || "Failed to load products", "error");
        setProductsData(null);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);

      // Extract error message for better user feedback
      let errorMessage = "Failed to load products. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, "error");
      setProductsData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns: Column<Product>[] = [
    {
      header: "Product",
      key: "productName",
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100">
            <Image
              src={item.productImageUrl || "/images/placeholder.png"}
              alt={item.productName}
              width={40}
              height={40}
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <span className="font-medium">{item.productName}</span>
        </div>
      ),
    },
    {
      header: "Product ID",
      key: "uuid",
      render: (value) => (
        <span className="text-sm text-gray-500">{value.slice(0, 8)}...</span>
      ),
    },
  ];

  return (
    <Wrapper>
      <div className="p-6 space-y-6">
        {/* Overview Cards */}
        {productsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {getOverviewCards(productsData).map((card, index) => (
              <ProductOverviewCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <Link href={"/products/add-product"}>
            <Button type="button" primary>
              Add new product
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg text-sm min-w-[240px]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : productsData?.products?.content?.length ? (
            <>
              <Table
                columns={columns}
                data={productsData.products.content}
                onRowClick={(product) =>
                  console.log("Clicked product:", product)
                }
              />
              <Pagination
                currentPage={currentPage}
                totalPages={productsData.products.totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="flex flex-col justify-center items-center py-12">
              <p className="text-gray-500 text-center mb-4">
                No products found. Add your first product to get started!
              </p>
              <Link href={"/products/add-product"}>
                <Button type="button" primary>
                  Add new product
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
