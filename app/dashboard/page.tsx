"use client";

import React from "react";
import Wrapper from "../components/wrapper/Wrapper";

const AllProductsPage = () => {
  return (
    <Wrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">All Products</h1>
        <p className="text-gray-600">
          Browse through our complete collection of products across all
          categories.
        </p>
      </div>
    </Wrapper>
  );
};

export default AllProductsPage;
