"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { BiPowerOff } from "react-icons/bi";
import { MdArrowOutward } from "react-icons/md";
import { Column, Table } from "@/app/components/common/Table";
import { cn } from "@/app/lib/utils";
import Wrapper from "@/app/components/wrapper/Wrapper";
import Button from "@/app/components/common/Button";
import Modal from "@/app/components/common/Modal";
import AddProductToStore from "@/app/components/store/forms/AddProductToStore";
import { getStoreById, addProductToStore } from "@/app/services/AuthService";
import { showToast } from "@/app/components/utils/helperFunctions";
import { SkeletonOverviewCard, SkeletonTable } from "@/app/components/common/Skeleton";

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  isAvailable: boolean;
  code: string;
}

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  avatars?: string[];
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  avatars,
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center bg-[#F8F9FB] rounded-lg">
          <Image src={icon} alt={title} width={24} height={24} />
        </div>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-bold">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {avatars && avatars.length > 0 && (
          <div className="flex -space-x-2">
            {avatars.map((avatar, index) => (
              <Image
                key={index}
                src={avatar}
                alt="Member"
                width={24}
                height={24}
                className="rounded-full border-2 border-white"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StorePage = () => {
  const params = useParams();
  const storeId = params.id as string;
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [addProductLoading, setAddProductLoading] = useState(false);

  const openAddProductModal = () => setIsAddProductOpen(true);
  const closeAddProductModal = () => setIsAddProductOpen(false);

  const fetchStoreData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getStoreById(storeId);
      setStore(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching store data:", error);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    if (storeId) {
      fetchStoreData();
    }
  }, [storeId, fetchStoreData]);

  const handleAddProductToStore = async (data: {
    productUuid: string;
    storeUuid: string;
    quantity: number;
    price: number;
  }) => {
    setAddProductLoading(true);
    try {
      const response = await addProductToStore(data);
      
      showToast("Product added to store successfully!", "success");
      
      // Refresh store data to show updated products
      await fetchStoreData();
      
      // Close modal
      closeAddProductModal();
    } catch (error: any) {
      console.error("Error adding product to store:", error);
      
      // Extract error message from response
      let errorMessage = "Failed to add product to store. Please try again.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast(errorMessage, "error");
      throw error; // Re-throw to let the modal handle the error
    } finally {
      setAddProductLoading(false);
    }
  };

  const overviewData = [
    {
      title: "Active products",
      value: store?.products?.length || "0",
      icon: "/icons/box.svg",
    },
    {
      title: "Members",
      value: store?.members?.length || "0",
      icon: "/icons/people.svg",
      avatars:
        store?.members
          ?.slice(0, 3)
          ?.map((member: any) => member?.avatar || "/images/avatar1.svg") || [],
    },
    {
      title: "Orders",
      value: store?.orders?.length || "0",
      icon: "/icons/orderIcon.svg",
      subtitle: "All time",
    },
  ];

  const columns: Column<Product>[] = [
    {
      header: "Product",
      key: "name",
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-100">
            <Image
              src={item.image || "/images/placeholder.png"}
              alt={item.name}
              width={40}
              height={40}
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
          className={cn(
            "px-3 py-1 rounded-full text-sm",
            value ? "text-green" : "bg-yellow-100 text-yellow-600"
          )}
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

  if (loading) {
    return (
      <Wrapper>
        <div className="p-8 space-y-8">
          {/* Header Skeleton */}
          <div>
            <div className="h-8 bg-gray-200 rounded-md w-64 mb-2 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded-md w-96 animate-pulse" />
          </div>

          {/* Overview Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonOverviewCard key={index} />
            ))}
          </div>

          {/* Table Skeleton */}
          <SkeletonTable rows={5} columns={5} />
        </div>
      </Wrapper>
    );
  }

  if (!store) {
    return (
      <Wrapper>
        <div className="p-8 flex justify-center items-center">
          <p className="text-gray-500">Store not found</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper title={store.name ? `Stores ▸ ${store.name}` : "Store"}>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {store.name || "Store Overview"}
          </h1>
          <p className="text-gray-500">
            {store.description ||
              "Track your store's performance and manage your products"}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {overviewData.map((item, index) => (
            <OverviewCard key={index} {...item} />
          ))}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 flex items-center justify-between border-b">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="flex items-center justify-between gap-4">
              <Button type="button" primary onClick={openAddProductModal}>
                Add products to store
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 w-full">Filter by</span>
                <div className="flex gap-2">
                  <select className="border rounded-lg px-4 py-2 text-sm min-w-[120px]">
                    <option>Price</option>
                  </select>
                  <select className="border rounded-lg px-4 py-2 text-sm min-w-[120px]">
                    <option>Quantity</option>
                  </select>
                  <select className="border rounded-lg px-4 py-2 text-sm min-w-[120px]">
                    <option>Availability</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            data={store.products || []}
            emptyState={
              <div className="text-center py-8">
                <p className="text-gray-500">No products in this store yet.</p>
                <p className="text-sm text-gray-400 mt-2">Add products to get started.</p>
              </div>
            }
          />
        </div>
      </div>

      {/* Add Product to Store Modal */}
      <Modal isOpen={isAddProductOpen} onClose={closeAddProductModal}>
        <div className="text-black">
          <AddProductToStore
            storeUuid={storeId}
            handleSubmit={handleAddProductToStore}
            onClose={closeAddProductModal}
            loading={addProductLoading}
          />
        </div>
      </Modal>
    </Wrapper>
  );
};

export default StorePage;
