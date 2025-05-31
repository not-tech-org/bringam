"use client";

import React, { useState, useEffect } from "react";
import { Column, Table } from "@/app/components/common/Table";
import Wrapper from "@/app/components/wrapper/Wrapper";
import { IoSearch } from "react-icons/io5";
import Pagination from "@/app/components/common/Pagination";
import Button from "../components/common/Button";
import Link from "next/link";
import { getAllProducts } from "../services/AuthService";

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  isAvailable: boolean;
  code: string;
}

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      console.log("Products:", response.data);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
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
      key: "name",
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      header: "Price",
      key: "price",
      render: (value) => (
        <span className="font-medium">₦{Number(value).toLocaleString()}</span>
      ),
    },
    {
      header: "Quantity",
      key: "quantity",
      render: (value) => <span>{Number(value)}pcs</span>,
    },
    {
      header: "Availability",
      key: "isAvailable",
      render: (value) => (
        <span
          className={
            value
              ? "text-[#027A48] bg-[#ECFDF3] px-3 py-1 rounded-full text-sm"
              : "text-[#B42318] bg-[#FEF3F2] px-3 py-1 rounded-full text-sm"
          }
        >
          {value ? "In stock" : "Out of stock"}
        </span>
      ),
    },
    {
      header: "Product code",
      key: "code",
    },
  ];

  return (
    <Wrapper>
      <div className="p-6 space-y-6">
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
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg text-sm min-w-[240px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Filter by</span>
              <div className="flex gap-2">
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="border rounded-lg px-4 py-2 text-sm min-w-[120px]"
                >
                  <option value="">Price</option>
                  <option value="low">Low to High</option>
                  <option value="high">High to Low</option>
                </select>
                <select
                  value={quantityFilter}
                  onChange={(e) => setQuantityFilter(e.target.value)}
                  className="border rounded-lg px-4 py-2 text-sm min-w-[120px]"
                >
                  <option value="">Quantity</option>
                  <option value="low">Low to High</option>
                  <option value="high">High to Low</option>
                </select>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="border rounded-lg px-4 py-2 text-sm min-w-[120px]"
                >
                  <option value="">Availability</option>
                  <option value="in">In Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <Table
                columns={columns}
                data={products}
                onRowClick={(product) =>
                  console.log("Clicked product:", product)
                }
              />
              <Pagination
                currentPage={currentPage}
                totalPages={5}
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
