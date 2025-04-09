"use client";

import React from "react";
import Image from "next/image";
import { BiPowerOff } from "react-icons/bi";
import { MdArrowOutward } from "react-icons/md";
import { Column, Table } from "@/app/components/common/Table";
import { cn } from "@/app/lib/utils";
import Wrapper from "@/app/components/wrapper/Wrapper";
import Button from "@/app/components/common/Button";

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  isAvailable: boolean;
  code: string;
}

const dummyProducts: Product[] = [
  {
    id: "1",
    image: "/images/choc.png",
    name: "Chocolate bar",
    price: 2500,
    quantity: 20,
    isAvailable: true,
    code: "#12568",
  },
  {
    id: "2",
    image: "/images/head.png",
    name: "Beats Headset",
    price: 80000,
    quantity: 8,
    isAvailable: true,
    code: "#46892",
  },
  {
    id: "3",
    image: "/images/choc.png",
    name: "iPhone 8",
    price: 90000,
    quantity: 16,
    isAvailable: false,
    code: "#12568",
  },
  {
    id: "4",
    image: "/images/head.png",
    name: "Beats Headset",
    price: 80000,
    quantity: 8,
    isAvailable: true,
    code: "#46892",
  },
];

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
  const overviewData = [
    {
      title: "Active products",
      value: "22",
      icon: "/icons/box.svg",
    },
    {
      title: "Members",
      value: "4",
      icon: "/icons/people.svg",
      avatars: [
        "/images/avatar1.svg",
        "/images/avatar1.svg",
        "/images/avatar1.svg",
      ],
    },
    {
      title: "Orders",
      value: "24",
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

  return (
    <Wrapper>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Overview</h1>
          <p className="text-gray-500">
            Track your store's performance and manage your products
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
              <Button type="button" primary>
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
            data={dummyProducts}
            onRowClick={(product) => console.log("Clicked product:", product)}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default StorePage;
