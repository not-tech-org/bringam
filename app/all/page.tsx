"use client";

import React, { useState, useEffect, useCallback } from "react";
import AppLayout from "../components/AppLayout";
import Header from "../components/Header";
import Wrapper from "../components/wrapper/Wrapper";
import Image from "next/image";
import Button from "../components/common/Button";
import { FaArrowRight, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { StoreData } from "../types/store";
import Preloader from "../components/common/Preloader";
import Link from "next/link";

const storeList: Partial<StoreData>[] = [
  { 
    profilePhotoUrl: "/images/stores/fashion-store.jpg",
    name: "Fashion Hub",
    description: "Premium Fashion",
    category: "Fashion",
    active: true
  },
  { 
    profilePhotoUrl: "/images/stores/electronics-store.jpg",
    name: "Tech World",
    description: "Latest Electronics",
    category: "Electronics",
    active: true
  },
  { 
    profilePhotoUrl: "/images/stores/food-store.jpg",
    name: "Gourmet Delights",
    description: "Fine Dining",
    category: "Food & Dining",
    active: true
  },
  { 
    profilePhotoUrl: "/images/stores/beauty-store.jpg",
    name: "Beauty Zone",
    description: "Health & Beauty",
    category: "Health & Beauty",
    active: false
  },
];

function repeatElements<T>(array: T[], times: number): T[] {
  return Array(times).fill(null).map((_, i) => ({
    ...array[i % array.length],
    id: i + 1,
  }));
}

const DashboardPage = () => {
  const [displayedStores, setDisplayedStores] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreStores = useCallback(() => {
    if (isLoading) return;
    
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setDisplayedStores(prev => prev + 8);
      setIsLoading(false);
    }, 500);
  }, [isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreStores();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreStores]);

  return (
    <Wrapper>
      <div className="bg-white min-h-screen">
        <div className="mx-auto px-4 pt-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Top stores near me</h1>
              <p className="text-sm text-gray-600 mt-1">Best stores around your location</p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Categories</option>
                <option value="fashion">Fashion</option>
                <option value="electronics">Electronics</option>
                <option value="food">Food & Dining</option>
                <option value="health">Health & Beauty</option>
              </select>
              <select className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {repeatElements(storeList, displayedStores)?.map((store, key) => (
              <div 
                key={key}
                className="bg-white rounded-lg border hover:shadow-md transition-shadow duration-200 flex flex-col"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={store.profilePhotoUrl || "/images/placeholder.png"}
                    alt={`${store.name} store front`}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  {store.active && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full border border-white/20">
                      Open
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{store.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{store.description}</p>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">4.5</span>
                    </div>
                  </div>

                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <FaMapMarkerAlt className="h-4 w-4" />
                    <span className="ml-1">2.3 km away</span>
                  </div>

                  <div className="mt-auto pt-3">
                    <Link href={`/store/${store.id || key + 1}`}>
                      <Button 
                        type="button"
                        style="w-full flex items-center justify-center gap-2"
                        primary
                      >
                        Visit Store
                        <FaArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="mt-8">
              <Preloader height={40} />
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default DashboardPage;