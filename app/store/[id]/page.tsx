"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Wrapper from "../../components/wrapper/Wrapper";
import Image from "next/image";
import Button from "../../components/common/Button";
import { FaArrowLeft, FaPhone, FaMapMarkerAlt, FaClock, FaStar, FaHeart, FaShare } from "react-icons/fa";

// Mock data - will be replaced with API integration later
const mockStoreData = {
  id: "1",
  name: "Fashion Hub",
  description: "Premium Fashion Store offering the latest trends and styles",
  category: "Fashion",
  rating: 4.8,
  totalRatings: 128,
  isOpen: true,
  openTime: "9:00 AM - 9:00 PM",
  phoneNumber: "+234 801 234 5678",
  email: "info@fashionhub.com",
  website: "www.fashionhub.com",
  address: {
    street: "123 Fashion Street",
    city: "Lagos",
    state: "Lagos State",
    landmark: "Near Victoria Island Mall"
  },
  coverPhotoUrl: "/images/stores/fashion-store-cover.jpg",
  profilePhotoUrl: "/images/stores/fashion-store.jpg",
  active: true,
  products: [
    {
      id: "1",
      name: "Designer Dress",
      price: "N25,000",
      image: "/images/products/dress1.jpg",
      category: "Dresses"
    },
    {
      id: "2", 
      name: "Casual Shirt",
      price: "N8,500",
      image: "/images/products/shirt1.jpg",
      category: "Shirts"
    },
    {
      id: "3",
      name: "Formal Pants",
      price: "N15,000", 
      image: "/images/products/pants1.jpg",
      category: "Pants"
    },
    {
      id: "4",
      name: "Summer Dress",
      price: "N12,000",
      image: "/images/products/dress2.jpg", 
      category: "Dresses"
    }
  ]
};

const StorePage = () => {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;
  
  // For now, we'll use mock data. Later this will be replaced with API call
  const store = mockStoreData;

  const handleBackToStores = () => {
    router.push('/all');
  };

  return (
    <Wrapper>
      <div className="bg-white min-h-screen">
        {/* Back Button */}
        <div className="px-4">
          <Button 
            type="button"
            style="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            onClick={handleBackToStores}
          >
            <FaArrowLeft className="h-4 w-4" />
            Back to Stores
          </Button>
        </div>

        {/* Store Header */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="relative h-64 w-full">
            <Image
              src={store.coverPhotoUrl || "/images/placeholder-cover.jpg"}
              alt={`${store.name} cover`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          </div>

          {/* Store Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {/* Semi-transparent card background */}
            <div className="bg-black/20 backdrop-blur-md rounded-t-2xl p-6 -mx-6 -mb-6">
              <div className="flex items-end gap-4">
                {/* Store Logo */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border-4 border-white shadow-xl">
                  <Image
                    src={store.profilePhotoUrl || "/images/placeholder.png"}
                    alt={`${store.name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Store Details */}
                <div className="flex-1 text-white">
                  <h1 className="text-2xl font-bold mb-1 drop-shadow-xl">{store.name}</h1>
                  <p className="text-sm opacity-95 mb-3 drop-shadow-lg">{store.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      <FaStar className="h-4 w-4 text-yellow-400" />
                      <span className="font-semibold">{store.rating}</span>
                      <span className="opacity-90">({store.totalRatings} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl border border-white/20 ${
                        store.isOpen ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
                      }`}>
                        {store.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors shadow-xl border border-white/20">
                    <FaHeart className="h-5 w-5 text-white" />
                  </button>
                  <button className="p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors shadow-xl border border-white/20">
                    <FaShare className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="p-6 space-y-6">
          {/* Contact & Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Store Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaClock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{store.openTime}</p>
                    <p className="text-xs text-gray-500">Store Hours</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaPhone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{store.phoneNumber}</p>
                    <p className="text-xs text-gray-500">Phone</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{store.address.street}</p>
                    <p className="text-xs text-gray-500">{store.address.city}, {store.address.state}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  type="button"
                  style="w-full flex items-center justify-center gap-2 bg-[#23856D] hover:bg-[#1a6b52] text-white"
                >
                  <FaPhone className="h-4 w-4" />
                  Call Store
                </Button>
                
                <Button 
                  type="button"
                  style="w-full flex items-center justify-center gap-2 bg-[#23A6F0] hover:bg-[#1e8dd4] text-white"
                >
                  <FaMapMarkerAlt className="h-4 w-4" />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Featured Products</h2>
              <Button type="button" style="text-[#23A6F0] hover:text-[#1e8dd4]">
                View All Products
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {store.products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                  <div className="relative h-32 w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className=" rounded-t-lg"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="font-semibold text-blue-600 mt-1">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default StorePage;
