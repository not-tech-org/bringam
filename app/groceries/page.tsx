"use client";

import React from "react";
import Wrapper from "../components/wrapper/Wrapper";

const GroceriesPage = () => {
  return (
    <Wrapper>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Groceries</h1>
        <p className="text-gray-600">
          Shop for fresh groceries, pantry essentials, and household items.
        </p>
      </div>
    </Wrapper>
  );
};

export default GroceriesPage;
