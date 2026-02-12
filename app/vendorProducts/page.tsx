"use client"

import React, { useState, useEffect } from "react";
import { MdWebStories } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoGiftOutline } from "react-icons/io5";
import { TbShoppingBag } from "react-icons/tb";
import Image from "next/image";
import Link from "next/link";

import AppLayout from "../components/AppLayout";
import Header from "../components/Header";
import { ProductCardUp, ProductCardDown } from "./components/ProductCard";
import { productTableHead } from "./components/productData";
import { useCookies } from "../components/utils/helperFunctions";
import { redirect } from "next/navigation";
import { getAllProducts } from "../services/AuthService";
import { showToast } from "../components/utils/helperFunctions";
import Preloader from "../components/common/Preloader";

interface Product {
  uuid: string;
  productName: string;
  vendorUuid: string;
  productImageUrl: string;
  price?: number;
  quantity?: number;
  isAvailable?: boolean;
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
      };
      totalPages: number;
      totalElements: number;
    };
  };
}

const Products = () => {
  const { getCookie } = useCookies();
  const token: any = getCookie("bringAmToken");
  const [productsData, setProductsData] = useState<ProductsResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  if (!token) {
    return redirect("/");
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      if (response.data.success) {
        setProductsData(response.data.data);
      } else {
        showToast(response.data.message || "Failed to load products", "error");
        setProductsData(null);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      let errorMessage = "Failed to load products. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showToast(errorMessage, "error");
      setProductsData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `N ${amount.toLocaleString()}`;
  };

  const productCardUpData = productsData ? [
    {
      text: "Sales overview",
      amount: formatCurrency(productsData.salesOverview),
      timeFrame: "All time",
    },
    {
      text: "Products in stock",
      amount: productsData.productsInStock.toString(),
    },
    {
      text: "Active Products",
      amount: productsData.activeProducts.toString(),
    },
  ] : [];

  const productCardDownData = productsData ? [
    {
      text: "Product views",
      amount: productsData.productViews.toString(),
      timeFrame: "All time",
    },
    {
      text: "Total products sold",
      amount: productsData.totalProductsSold.toString(),
    },
    {
      text: "Active Products",
      amount: productsData.activeProducts.toString(),
    },
  ] : [];

  const tableData = productsData?.products?.content?.map((product) => ({
    image: product.productImageUrl || "/images/placeholder.png",
    text: product.productName,
    price: product.price ? formatCurrency(product.price) : "N0",
    availability: product.isAvailable !== false ? "In Stock" : "Out of stock",
    qtyInStock: product.quantity?.toString() || "0",
  })) || [];
  if (loading) {
    return (
      <AppLayout>
        <Header />
        <div className="flex justify-center items-center min-h-[400px]">
          <Preloader height={45} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Header />
      {productCardUpData.length > 0 && (
        <div className="flex items-center flex-wrap justify-between mt-[1rem] w-full gap-[1.5rem]">
          {productCardUpData.map((item, index) => (
            <div key={index}>
              <ProductCardUp
                text={item.text}
                amount={item.amount}
                timeFrame={item.timeFrame}
              />
            </div>
          ))}
        </div>
      )}
      {productCardDownData.length > 0 && (
        <div className="flex items-center flex-wrap justify-between mt-[1rem] w-full gap-[1.5rem]">
          {productCardDownData.map((item, index) => (
            <div key={index}>
              <ProductCardDown
                text={item.text}
                amount={item.amount}
                timeFrame={item.timeFrame}
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-start flex-wrap md:items-center flex-col md:flex-row justify-between mt-[3rem] gap-[1rem]">
        <button className="rounded-[4px] py-[10px] px-[15px] bg-grayPrimary text-medium text-black2 text-sm">
          All Products
        </button>
        <div className="flex items-center gap-[2rem]">
          <Link
            href="products/create_an_offer"
            className="bg-bluePrimary rounded-[4px] py-[10px] px-[10px] md:px-[15px] flex items-center gap-[.5rem] text-white text-sm">
            <IoGiftOutline className=" w-[21.5px] h-[20.5px] hidden md:block" />
            Create an offer
          </Link>
          <Link
            href="products/add_product"
            className="bg-black2 rounded-[4px] py-[10px] px-[15px] flex items-center gap-[.5rem] text-white text-sm">
            <TbShoppingBag className="w-[21.5px] h-[20.5px] hidden md:block" />
            Add new product
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto mt-[4rem]">
        <table className="overflow-x-auto overflow-hidden w-[1000px] table-fixed">
          <thead className="table-auto overflow-x-auto w-[1000px] md:w-full overflow-scroll">
            <tr className="h-[40px]  border-b-2 border-b-borderColor ">
              {productTableHead.map((item, index) => (
                <th
                  className={` font-medium pl-[.5rem] text-sm leading-[16px] py-[1rem] text-black1 ${
                    index === 0
                      ? "sticky left-0 text-start z-50 w-[12rem]"
                      : "w-[10rem] text-center"
                  }`}
                  key={index}>
                  {item.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((item, index) => (
                <tr className="h-[40px]" key={index}>
                <td className="flex items-center gap-[1rem] py-[1rem] ">
                  <Image
                    src={item.image}
                    alt="Image of Product"
                    className="w-[48px] h-[48px] rounded-[2px] object-cover"
                  />
                  <p className="font-medium leading-[24px] text-black2">
                    {item.text}
                  </p>
                </td>
                <td className="text-bluePrimary font-medium text-center text-sm leading-[24px] py-[1rem] ">
                  {item.price}
                </td>
                <td className="py-[1rem]">
                  {item.availability.toLowerCase() === "in stock" ? (
                    <div className="flex items-center justify-center gap-[1rem] text-successPrimary bg-bgSuccessPrimary w-[150px] mx-auto p-[10px]  rounded-[5px]">
                      <MdWebStories className="w-[13.5px] h-[13.5px] rounded-[2px] object-cover" />
                      <p className="font-medium leading-[17.07px] text-sm">
                        In Stock
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-[1rem] text-errorPrimary bg-bgErrorPrimary w-[150px] mx-auto p-[10px]  rounded-[5px]">
                      <MdWebStories className="w-[13.5px] h-[13.5px] rounded-[2px] object-cover" />
                      <p className="font-medium leading-[17.07px] text-sm">
                        Out of stock
                      </p>
                    </div>
                  )}
                </td>
                <td className="py-[1rem]">
                  <div className="flex items-center justify-center gap-[1rem] text-bluePrimary bg-bgBluePrimary w-[100px] mx-auto p-[10px]  rounded-[5px]">
                    <IoCheckmarkDoneSharp className="w-[13.5px] h-[13.5px] rounded-[2px] object-cover" />
                    <p className="font-medium leading-[17.07px] text-sm">
                      {item.qtyInStock}
                    </p>
                  </div>
                </td>
              </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  <p className="text-gray-500">No products found. Add your first product to get started!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
};

export default Products;
